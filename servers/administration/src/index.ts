import { AdministrationController } from './infrastructure/administration.controller';
import { InvoicesModulesConfig } from './news-modules.config';

import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { FirebaseDataSource, FileRepository } from '@deporty-org/core';
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

const logger = new Logger('development.log');

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

InvoicesModulesConfig.config(GENERAL_DEPENDENCIES_CONTAINER);

// const middleware = GENERAL_DEPENDENCIES_CONTAINER
//   .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
//   .instance.getValidator();
// app.use(middleware);
AdministrationController.registerEntryPoints(router, GENERAL_DEPENDENCIES_CONTAINER);
app.use('/administration', router);
app.listen(10009, () => {
  logger.info('Starting administration');
  console.log('Starting administration');
});
