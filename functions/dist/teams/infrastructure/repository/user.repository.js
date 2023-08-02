"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const user_constract_1 = require("../../domain/contracts/user.constract");
const teams_constants_1 = require("../teams.constants");
class UserRepository extends user_constract_1.UserContract {
    getUserInformationById(userId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${teams_constants_1.USERS_SERVER}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${teams_constants_1.BEARER_TOKEN}`,
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
    getUsersByIds(userIds) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${teams_constants_1.USERS_SERVER}/ids`, {
                headers: {
                    Authorization: `Bearer ${teams_constants_1.BEARER_TOKEN}`,
                },
                params: {
                    ids: userIds,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'USER:GET-BY-IDS:SUCCESS') {
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
