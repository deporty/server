import { of } from 'rxjs';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { LocationController } from './infrastructure/location.controller';
import { LocationsModulesConfig } from './locations-modules.config';

import { FileRepository, FirebaseDataSource, IsKeyPresentMiddleware } from '@deporty-org/core';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { DataSource, FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Router } from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Storage, getStorage } from 'firebase-admin/storage';
import { env } from '../environments/env';
import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');

const logger = require('logger').createLogger('development.log');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

LocationsModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);

GENERAL_DEPENDENCIES_CONTAINER.addValue({
  id: 'is-key-present-flag',
  value: env.middlewares['is-key-present'],
});

const authorizationContract: AuthorizationContract | null =
  GENERAL_DEPENDENCIES_CONTAINER.getInstance<AuthorizationContract>('AuthorizationContract').instance;

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

const middleware = GENERAL_DEPENDENCIES_CONTAINER.getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware').instance?.getValidator();
if (middleware) {
  app.use(middleware);
}

LocationController.registerEntryPoints(router, GENERAL_DEPENDENCIES_CONTAINER);

app.use('/locations', router);

app.listen(10003, () => {
  logger.info('Starting locations');
});
