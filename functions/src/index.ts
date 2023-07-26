import { cert, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { getStorage, Storage } from 'firebase-admin/storage';
import { Container } from './core/DI';

// import { main as PlayerFunction } from './players';
import { main as AuthorizationFunction } from './authorization';
import { main as TeamFunction } from './teams';
import { main as TournamentFunction } from './tournaments';
import { main as InvoicesFunction } from './invoices';
import { main as OrganizationsFunction } from './organizations';
import { main as UsersFunction } from './users';
// import { main as RolesFunction } from './roles';
import { main as LocationsFunction } from './locations';

import { FirebaseDataSource } from './core/firebase.datasource';
import { DataSource } from './core/datasource';
import { FileAdapter } from './core/file/file.adapter';
import { FileRepository } from './core/file/file.repository';
import { env } from './environments/env';
import { Auth, getAuth } from 'firebase-admin/auth';

const { Logging } = require('@google-cloud/logging');

// var logger = require('logger').createLogger('development.log'); // logs to a file

const logging = new Logging(env.projectId);
const log = logging.log('my-log');
const logStub = {
  info: (message: string) => {
    const metadata = {
      resource: { type: 'global' },
      severity: 'INFO',
    };

    // Prepares a log entry
    const entry = log.entry(metadata, message);

    log.write(entry);
  },
  error: (message: string) => {
    const metadata = {
      resource: { type: 'global' },
      severity: 'ERROR',
    };

    // Prepares a log entry
    const entry = log.entry(metadata, message);

    log.write(entry);
  },
};

// const SimpleNodeLogger = require('simple-node-logger'),
//   opts = {
//     logFilePath: 'development.log',
//     timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
//   },
//   logger = SimpleNodeLogger.createSimpleLogger(opts);
// logger.setLevel('info');

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
  value: logStub,
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

//------------------------


const authorizationApp = AuthorizationFunction(GENERAL_DEPENDENCIES_CONTAINER);
// const playerConfig = PlayerFunction(GENERAL_DEPENDENCIES_CONTAINER);
const tournamentApp = TournamentFunction(GENERAL_DEPENDENCIES_CONTAINER);
const teamApp = TeamFunction(GENERAL_DEPENDENCIES_CONTAINER);
const usersApp = UsersFunction(GENERAL_DEPENDENCIES_CONTAINER);
const organizationsApp = OrganizationsFunction(GENERAL_DEPENDENCIES_CONTAINER);
const locationsApp = LocationsFunction(GENERAL_DEPENDENCIES_CONTAINER);

const invoicesConfig = InvoicesFunction(GENERAL_DEPENDENCIES_CONTAINER);
// exports.players = functions.https.onRequest(playerConfig.app);

exports.authorization = functions.https.onRequest(authorizationApp);
exports.tournaments = functions.https.onRequest(tournamentApp);
exports.teams = functions.https.onRequest(teamApp);
exports.users = functions.https.onRequest(usersApp);
exports.organizations = functions.https.onRequest(organizationsApp);
exports.locations = functions.https.onRequest(locationsApp);

exports.invoices = functions.https.onRequest(invoicesConfig.app);

// exports.tournaments = functions
//   .runWith({
//     timeoutSeconds: 400,
//     memory: '2GB',
//   })
//   .https.onRequest(tournamentConfig.app);
