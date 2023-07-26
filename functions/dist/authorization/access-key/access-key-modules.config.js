"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyModulesConfig = void 0;
const access_key_contract_1 = require("./domain/contracts/access-key.contract");
const is_a_valid_access_key_usecase_1 = require("./domain/usecases/is-a-valid-access-key/is-a-valid-access-key.usecase");
const access_key_mapper_1 = require("./infrastructure/mappers/access-key.mapper");
const access_key_repository_1 = require("./infrastructure/access-key.repository");
class AccessKeyModulesConfig {
    static config(container) {
        container.add({
            id: 'AccessKeyMapper',
            kind: access_key_mapper_1.AccessKeyMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'AccessKeyContract',
            kind: access_key_contract_1.AccessKeyContract,
            override: access_key_repository_1.AccessKeyRepository,
            dependencies: ['DataSource', 'AccessKeyMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'IsAValidAccessKeyUsecase',
            kind: is_a_valid_access_key_usecase_1.IsAValidAccessKeyUsecase,
            dependencies: ['AccessKeyContract'],
            strategy: 'singleton',
        });
    }
}
exports.AccessKeyModulesConfig = AccessKeyModulesConfig;
