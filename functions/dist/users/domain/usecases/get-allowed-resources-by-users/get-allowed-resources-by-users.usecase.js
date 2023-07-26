"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllowedResourcesByUsersUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetAllowedResourcesByUsersUsecase extends usecase_1.Usecase {
    constructor(getUserInformationByIdUsecase, authorizationContract) {
        super();
        this.getUserInformationByIdUsecase = getUserInformationByIdUsecase;
        this.authorizationContract = authorizationContract;
    }
    call(userId) {
        return this.getUserInformationByIdUsecase.call(userId).pipe((0, operators_1.mergeMap)((user) => {
            return user.roles.length > 0
                ? (0, rxjs_1.zip)(...user.roles.map((role) => {
                    return this.authorizationContract.getRoleById(role);
                }))
                : (0, rxjs_1.of)([]);
        }), (0, operators_1.mergeMap)((roles) => {
            return (0, rxjs_1.of)([]);
        }));
    }
}
exports.GetAllowedResourcesByUsersUsecase = GetAllowedResourcesByUsersUsecase;
