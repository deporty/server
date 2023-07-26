"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModulesConfig = void 0;
const user_repository_1 = require("./infrastructure/user.repository");
const get_user_information_by_email_usecase_1 = require("./domain/usecases/get-user-information-by-email/get-user-information-by-email.usecase");
const user_contract_1 = require("./user.contract");
const get_user_information_by_id_usecase_1 = require("./domain/usecases/get-user-information-by-id.usecase");
const user_mapper_1 = require("./infrastructure/user.mapper");
class UserModulesConfig {
    static config(container) {
        container.add({
            id: 'UserMapper',
            kind: user_mapper_1.UserMapper,
            dependencies: ['Firestore'],
            strategy: 'singleton',
        });
        container.add({
            id: 'UserContract',
            kind: user_contract_1.UserContract,
            override: user_repository_1.UserRepository,
            dependencies: ['DataSource', 'Firestore', 'UserMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUserInformationByEmailUsecase',
            kind: get_user_information_by_email_usecase_1.GetUserInformationByEmailUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetUserInformationByIdUsecase',
            kind: get_user_information_by_id_usecase_1.GetUserInformationByIdUsecase,
            dependencies: ['UserContract'],
            strategy: 'singleton',
        });
    }
}
exports.UserModulesConfig = UserModulesConfig;
