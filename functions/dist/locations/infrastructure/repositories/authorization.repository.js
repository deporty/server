"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const authorization_contract_1 = require("../../domain/contracts/authorization.contract");
const locations_constants_1 = require("../locations.constants");
class AuthorizationRepository extends authorization_contract_1.AuthorizationContract {
    isAValidAccessKey(accessKey) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${locations_constants_1.AUTHORIZATION_SERVER}/access-key/${accessKey}`, {
                headers: {
                    Authorization: `Bearer ${locations_constants_1.BEARER_TOKEN}`,
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
}
exports.AuthorizationRepository = AuthorizationRepository;
