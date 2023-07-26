"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignRolesToUserUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class AsignRolesToUserUsecase extends usecase_1.Usecase {
    constructor(getUserInformationByIdUsecase, authorizationContract, userContract) {
        super();
        this.getUserInformationByIdUsecase = getUserInformationByIdUsecase;
        this.authorizationContract = authorizationContract;
        this.userContract = userContract;
    }
    call(params) {
        return this.getUserInformationByIdUsecase.call(params.userId).pipe((0, operators_1.mergeMap)((user) => {
            const $roles = !!params.rolesIds.length
                ? (0, rxjs_1.zip)(...params.rolesIds.map((x) => this.authorizationContract.getRoleById(x)))
                : (0, rxjs_1.of)([]);
            return (0, rxjs_1.zip)($roles, (0, rxjs_1.of)(user));
        }), (0, operators_1.map)((data) => {
            const newRoles = data[0];
            const user = data[1];
            for (const newRole of newRoles) {
                const exists = user.roles.filter((roleId) => {
                    return newRole.id === roleId;
                }).length > 0;
                if (!exists) {
                    user.roles.push(newRole.id);
                }
            }
            return user;
        }), (0, operators_1.mergeMap)((user) => {
            return this.userContract.update(user.id, user);
        }));
    }
}
exports.AsignRolesToUserUsecase = AsignRolesToUserUsecase;
