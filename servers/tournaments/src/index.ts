import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { TournamentController } from './infrastructure/tournament.controller';
import { TournamentsModulesConfig } from './modules-config/tournaments-modules.config';

import { of } from 'rxjs';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { FirebaseDataSource, FileRepository, IsKeyPresentMiddleware, IsAuthorizedUserMiddleware } from '@deporty-org/core';
import { cert, initializeApp } from 'firebase-admin/app';
import { env } from '../environments/env';
import express = require('express');
import cors = require('cors');
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { Auth, getAuth } from 'firebase-admin/auth';
import { DataSource, FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import bodyParser = require('body-parser');
import { Router } from 'express';
import { Logger } from '@scifamek-open-source/logger';

const moment = require('moment-timezone');

const logger = new Logger('development.log');

moment.tz.setDefault('America/Bogota');


const firebaseApp = initializeApp({
  credential: cert(env.credentials),
  storageBucket: env.bucketName,
  projectId: env.projectId,
});

const db: Firestore = getFirestore(firebaseApp);
db.settings({ ignoreUndefinedProperties: true });

const storage: Storage = getStorage(firebaseApp);

const auth: Auth = getAuth(firebaseApp);

const GENERAL_DEPENDENCIES_CONTAINER = new Container();

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'Logger',
  value: logger,
});

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'Firestore',
  value: db,
});
GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'Auth',
  value: auth,
});

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'FirebaseStorage',
  value: storage,
});

GENERAL_DEPENDENCIES_CONTAINER.add({
  id: 'DataSource',
  kind: DataSource,
  strategy: 'singleton',
  dependencies: ['Firestore'],
  override: FirebaseDataSource,
});

GENERAL_DEPENDENCIES_CONTAINER.add({
  id: 'FileAdapter',
  kind: FileAdapter,
  strategy: 'singleton',
  dependencies: ['FirebaseStorage'],
  override: FileRepository,
});
const app = express();
const router = Router();
app.use(cors());

app.use(bodyParser.json( { limit: '100mb'}));

app.use(bodyParser.urlencoded({ extended: true }));

TournamentsModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'is-key-present-flag',
  value: env.middlewares['is-key-present'],
});

const authorizationContract = GENERAL_DEPENDENCIES_CONTAINER.getInstance<AuthorizationContract>('AuthorizationContract').instance;

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'IsAValidAccessKeyFunction',
  value: (key: string) => {
    return authorizationContract ? authorizationContract.isAValidAccessKey(key) : of(false);
  },
});

GENERAL_DEPENDENCIES_CONTAINER.add({
  id: 'IsKeyPresentMiddleware',
  kind: IsKeyPresentMiddleware,
  dependencies: ['IsAValidAccessKeyFunction', 'is-key-present-flag'],
  strategy: 'singleton',
});

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'is-authorized-user-flag',
  value: env.middlewares['is-authorized-user'],
});

GENERAL_DEPENDENCIES_CONTAINER.add({
  id: 'IsAuthorizedUserMiddleware',
  kind: IsAuthorizedUserMiddleware,
  strategy: 'singleton',
  dependencies: ['is-authorized-user-flag'],
});

const middleware = GENERAL_DEPENDENCIES_CONTAINER.getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware').instance?.getValidator();
if (middleware) {
  app.use(middleware);
}

if (Object.keys(GENERAL_DEPENDENCIES_CONTAINER.pending).length > 0) {
  console.log(GENERAL_DEPENDENCIES_CONTAINER.pending);
  
  process.exit(1);
}

TournamentController.registerEntryPoints(router, GENERAL_DEPENDENCIES_CONTAINER);
app.use('/tournaments', router);
app.listen(10007, () => {
  logger.info('Starting tournaments');
  console.log('Starting tournaments');
});
