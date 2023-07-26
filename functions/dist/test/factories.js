"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildContainer = void 0;
const datasource_1 = require("../core/datasource");
const DI_1 = require("../core/DI");
const firebase_datasource_1 = require("../core/firebase.datasource");
const firebase_datasource_mock_1 = require("./firebase-datasource.mock");
const firebase_storage_mock_1 = require("./firebase-storage.mock");
function buildContainer(entitiesModuleConfig) {
    const container = new DI_1.Container();
    container.addValue({
        id: 'FirebaseDatabase',
        value: new firebase_datasource_mock_1.FirebaseDatabaseMock(),
    });
    container.addValue({
        id: 'FirebaseStorage',
        value: new firebase_storage_mock_1.FirebaseStorageMock(),
    });
    container.add({
        id: 'DataSource',
        kind: datasource_1.DataSource,
        strategy: 'singleton',
        dependencies: ['FirebaseDatabase'],
        override: firebase_datasource_1.FirebaseDataSource,
    });
    entitiesModuleConfig.config(container);
    return container;
}
exports.buildContainer = buildContainer;
