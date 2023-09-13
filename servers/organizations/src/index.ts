import { OrganizationController } from './infrastructure/organization.controller';
import { OrganizationModulesConfig } from './organization-modules.config';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { of } from 'rxjs';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { FirebaseDataSource, FileRepository, IsKeyPresentMiddleware } from '@deporty-org/core';
import { cert, initializeApp } from 'firebase-admin/app';
import { env } from '../environments/env';
import express = require('express');
import cors = require('cors');
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { Auth, getAuth } from 'firebase-admin/auth';
import { DataSource, FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Router } from 'express';
const bodyParser = require('body-parser');
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

OrganizationModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);

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

const app = express();
const router = Router();
app.use(cors());

app.use(bodyParser.json()); // Para JSON
app.use(bodyParser.urlencoded({ extended: true })); //

const middleware = GENERAL_DEPENDENCIES_CONTAINER.getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware').instance?.getValidator();
if (middleware) {
  app.use(middleware);
}

OrganizationController.registerEntryPoints(router, GENERAL_DEPENDENCIES_CONTAINER);
app.use('/organizations', router);
app.listen(10005, () => {
  logger.info('Starting organizations');
});
