import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { FirebaseDataSource, FileRepository } from '@deporty-org/core';
import { AccessKeyModulesConfig } from './access-key/access-key-modules.config';
import { AuthorizationModulesConfig } from './authorization-modules.config';
import { AuthorizationController } from './authorization.controller';
import { PermissionModulesConfig } from './permissions/permissions-modules.config';
import { ResourceModulesConfig } from './resources/resources-modules.config';
import { RoleModulesConfig } from './roles/roles-modules.config';
import { DataSource, FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { Auth, getAuth } from 'firebase-admin/auth';
import { cert, initializeApp } from 'firebase-admin/app';
import { env } from '../environments/env';
import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');
import { Router } from 'express';

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
app.use(bodyParser.urlencoded({ extended: true ,}));

RoleModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);
PermissionModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);
ResourceModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);
AccessKeyModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);
AuthorizationModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);

// const middleware = ownContainer
//   .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
//   .instance.getValidator();
// app.use(middleware);

AuthorizationController.registerEntryPoints(router, GENERAL_DEPENDENCIES_CONTAINER);

app.use('/authorization', router);

app.listen(10001, () => {
  logger.info('Starting authorization');
  console.log('Starting authorization');
});
