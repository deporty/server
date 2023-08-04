"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const user_constract_1 = require("../../domain/contracts/user.constract");
const authorization_constants_1 = require("../authorization.constants");
class UserRepository extends user_constract_1.UserContract {
    getUserInformationByEmail(email) {
        console.log(authorization_constants_1.USERS_SERVER);
        console.log(authorization_constants_1.BEARER_TOKEN);
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${authorization_constants_1.USERS_SERVER}/email/${email}`, {
                headers: {
                    Authorization: `Bearer ${authorization_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'USER:GET-BY-EMAIL:SUCCESS') {
                    observer.next(data.data);
                }
                else {
                    observer.error();
                }
                observer.complete();
            })
                .catch((error) => {
                console.log(error);
                observer.error(error);
            });
        });
    }
    getUserInformationById(userId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${authorization_constants_1.USERS_SERVER}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authorization_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'USER:GET-BY-ID:SUCCESS') {
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
exports.UserRepository = UserRepository;
