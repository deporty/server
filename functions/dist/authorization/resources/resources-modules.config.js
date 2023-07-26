"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceModulesConfig = void 0;
const resource_contract_1 = require("./domain/resource.contract");
const get_resource_by_id_usecase_1 = require("./domain/usecases/get-resource-by-id.usecase");
const resource_mapper_1 = require("./infrastructure/resource.mapper");
const resource_repository_1 = require("./infrastructure/resource.repository");
class ResourceModulesConfig {
    static config(container) {
        container.add({
            id: 'ResourceMapper',
            kind: resource_mapper_1.ResourceMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'ResourceContract',
            kind: resource_contract_1.ResourceContract,
            override: resource_repository_1.ResourceRepository,
            dependencies: ['DataSource', 'ResourceMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetResourceByIdUsecase',
            kind: get_resource_by_id_usecase_1.GetResourceByIdUsecase,
            dependencies: ['ResourceContract'],
            strategy: 'singleton',
        });
    }
}
exports.ResourceModulesConfig = ResourceModulesConfig;
