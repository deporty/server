"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokenUsecase = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../../core/usecase");
const operators_1 = require("rxjs/operators");
const jsonwebtoken_1 = require("jsonwebtoken");
const authorization_constants_1 = require("../../../infrastructure/authorization.constants");
class GetTokenUsecase extends usecase_1.Usecase {
    constructor(getAllowedResourcesByRoleIdsUsecase, userContract) {
        super();
        this.getAllowedResourcesByRoleIdsUsecase = getAllowedResourcesByRoleIdsUsecase;
        this.userContract = userContract;
    }
    call(email) {
        return this.userContract.getUserInformationByEmail(email).pipe((0, operators_1.mergeMap)((user) => {
            return (0, rxjs_1.zip)((0, rxjs_1.of)(user), this.getAllowedResourcesByRoleIdsUsecase.call(user.roles));
        }), (0, operators_1.map)(([user, resources]) => {
            const payload = {
                user,
                resources,
            };
            const token = (0, jsonwebtoken_1.sign)(payload, authorization_constants_1.JWT_SECRET);
            return token;
        }));
    }
}
exports.GetTokenUsecase = GetTokenUsecase;
