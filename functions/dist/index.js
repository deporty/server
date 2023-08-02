"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const storage_1 = require("firebase-admin/storage");
const DI_1 = require("./core/DI");
// import { main as PlayerFunction } from './players';
const authorization_1 = require("./authorization");
const teams_1 = require("./teams");
const tournaments_1 = require("./tournaments");
const invoices_1 = require("./invoices");
const organizations_1 = require("./organizations");
const users_1 = require("./users");
// import { main as RolesFunction } from './roles';
const locations_1 = require("./locations");
const firebase_datasource_1 = require("./core/firebase.datasource");
const datasource_1 = require("./core/datasource");
const file_adapter_1 = require("./core/file/file.adapter");
const file_repository_1 = require("./core/file/file.repository");
const env_1 = require("./environments/env");
const auth_1 = require("firebase-admin/auth");
const { Logging } = require('@google-cloud/logging');
// var logger = require('logger').createLogger('development.log'); // logs to a file
const logging = new Logging(env_1.env.projectId);
const log = logging.log('my-log');
const logStub = {
    info: (message) => {
        const metadata = {
            resource: { type: 'global' },
            severity: 'INFO',
        };
        // Prepares a log entry
        const entry = log.entry(metadata, message);
        log.write(entry);
    },
    error: (message) => {
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
const firebaseApp = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(env_1.env.credentials),
    storageBucket: env_1.env.bucketName,
    projectId: env_1.env.projectId,
});
const db = (0, firestore_1.getFirestore)(firebaseApp);
db.settings({ ignoreUndefinedProperties: true });
const storage = (0, storage_1.getStorage)(firebaseApp);
const auth = (0, auth_1.getAuth)(firebaseApp);
const GENERAL_DEPENDENCIES_CONTAINER = new DI_1.Container();
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
    kind: datasource_1.DataSource,
    strategy: 'singleton',
    dependencies: ['Firestore'],
    override: firebase_datasource_1.FirebaseDataSource,
});
GENERAL_DEPENDENCIES_CONTAINER.add({
    id: 'FileAdapter',
    kind: file_adapter_1.FileAdapter,
    strategy: 'singleton',
    dependencies: ['FirebaseStorage'],
    override: file_repository_1.FileRepository,
});
//------------------------
const authorizationApp = (0, authorization_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
// const playerConfig = PlayerFunction(GENERAL_DEPENDENCIES_CONTAINER);
const tournamentApp = (0, tournaments_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
const teamApp = (0, teams_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
const usersApp = (0, users_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
const organizationsApp = (0, organizations_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
const locationsApp = (0, locations_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
const invoicesConfig = (0, invoices_1.main)(GENERAL_DEPENDENCIES_CONTAINER);
// exports.players = functions.https.onRequest(playerConfig.app);
exports.authorization = functions.https.onRequest(authorizationApp);
exports.tournaments = functions.https.onRequest(tournamentApp);
exports.teams = functions
    .runWith({
    timeoutSeconds: 400,
    memory: '2GB',
})
    .https.onRequest(teamApp);
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
