"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationRepository = void 0;
const rxjs_1 = require("rxjs");
const authorization_contract_1 = require("../../domain/contracts/authorization.contract");
const axios_1 = require("axios");
const users_constants_1 = require("../users.constants");
class AuthorizationRepository extends authorization_contract_1.AuthorizationContract {
    getPermissionById(permissionId) {
        throw new Error('Method not implemented.');
    }
    getResourceById(resourceId) {
        throw new Error('Method not implemented.');
    }
    isAValidAccessKey(accessKey) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${users_constants_1.AUTHORIZATION_SERVER}/access-key/${accessKey}`, {
                headers: {
                    Authorization: `Bearer ${users_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'AUTHORIZATION:VALID-ACCESS-KEY:SUCCESS') {
                    observer.next(data.data);
                }
                else {
                    observer.error();
                }
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
            });
        });
    }
    getRoleById(roleId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${users_constants_1.AUTHORIZATION_SERVER}/${roleId}`, {
                headers: {
                    Authorization: `Bearer ${users_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'AUTHORIZATION:GET-ROLE-BY-ID:SUCCESS') {
                    observer.next(data.data);
                }
                else {
                    observer.error();
                }
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
            });
        });
    }
}
exports.AuthorizationRepository = AuthorizationRepository;
