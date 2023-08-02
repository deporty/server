"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModulesConfig = void 0;
const asign_roles_to_user_usecase_1 = require("./domain/usecases/asign-roles-to-user/asign-roles-to-user.usecase");
const get_user_by_filters_usecase_1 = require("./domain/usecases/get-user-by-filters/get-user-by-filters.usecase");
const get_user_information_by_email_usecase_1 = require("./domain/usecases/get-user-information-by-email/get-user-information-by-email.usecase");
const get_user_information_by_full_name_usecase_1 = require("./domain/usecases/get-user-information-by-full-name/get-user-information-by-full-name.usecase");
const get_users_by_rol_usecase_1 = require("./domain/usecases/get-users-by-rol/get-users-by-rol.usecase");
const user_contract_1 = require("./domain/contracts/user.contract");
const user_mapper_1 = require("./infrastructure/mappers/user.mapper");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const authorization_repository_1 = require("./infrastructure/repositories/authorization.repository");
const authorization_contract_1 = require("./domain/contracts/authorization.contract");
const get_user_by_id_usecase_1 = require("./domain/usecases/get-user-by-id/get-user-by-id.usecase");
const get_users_by_ids_usecase_1 = require("./domain/usecases/get-users-by-ids/get-users-by-ids.usecase");
class UserModulesConfig {
    static config(container) {
        container.add({
            id: 'UserMapper',
            kind: user_mapper_1.UserMapper,
            dependencies: ['FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'UserContract',
            kind: user_contract_1.UserContract,
            override: user_repository_1.UserRepository,
            dependencies: ['DataSource', 'UserMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AuthorizationContract',
            kind: authorization_contract_1.AuthorizationContract,
            override: authorization_repository_1.AuthorizationRepository,
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUsersByFiltersUsecase',
            kind: get_user_by_filters_usecase_1.GetUsersByFiltersUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUserInformationByEmailUsecase',
            kind: get_user_information_by_email_usecase_1.GetUserInformationByEmailUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUserByIdUsecase',
            kind: get_user_by_id_usecase_1.GetUserByIdUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUsersByIdsUsecase',
            kind: get_users_by_ids_usecase_1.GetUsersByIdsUsecase,
            dependencies: ['GetUserByIdUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AsignRolesToUserUsecase',
            kind: asign_roles_to_user_usecase_1.AsignRolesToUserUsecase,
            dependencies: [
                'GetUserByIdUsecase',
                'AuthorizationContract',
                'UserContract',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUserInformationByFullNameUsecase',
            kind: get_user_information_by_full_name_usecase_1.GetUserInformationByFullNameUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUsersByRolUsecase',
            kind: get_users_by_rol_usecase_1.GetUsersByRolUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
    }
}
exports.UserModulesConfig = UserModulesConfig;
