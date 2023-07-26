"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationModulesConfig = void 0;
const user_constract_1 = require("./domain/contracts/user.constract");
const get_allowed_resources_by_role_ids_usecase_1 = require("./domain/usecases/get-allowed-resources-by-role-ids/get-allowed-resources-by-role-ids.usecase");
const get_token_usecase_1 = require("./domain/usecases/get-token/get-token.usecase");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
class AuthorizationModulesConfig {
    static config(container) {
        container.add({
            id: 'UserContract',
            kind: user_constract_1.UserContract,
            override: user_repository_1.UserRepository,
            strategy: 'singleton',
        });
        container.add({
            id: 'GetAllowedResourcesByRoleIdsUsecase',
            kind: get_allowed_resources_by_role_ids_usecase_1.GetAllowedResourcesByRoleIdsUsecase,
            strategy: 'singleton',
            dependencies: [
                'GetRoleByIdUsecase',
                'GetPermissionByIdUsecase',
                'GetResourceByIdUsecase',
            ],
        });
        container.add({
            id: 'GetTokenUsecase',
            kind: get_token_usecase_1.GetTokenUsecase,
            dependencies: ['GetAllowedResourcesByRoleIdsUsecase', 'UserContract'],
            strategy: 'singleton',
        });
    }
}
exports.AuthorizationModulesConfig = AuthorizationModulesConfig;
