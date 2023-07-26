"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const user_constract_1 = require("../../domain/contracts/user.constract");
const organizations_constants_1 = require("../organizations.constants");
class UserRepository extends user_constract_1.UserContract {
    getUserInformationByEmail(email) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${organizations_constants_1.USERS_SERVER}/email/${email}`, {
                headers: {
                    Authorization: `Bearer ${organizations_constants_1.BEARER_TOKEN}`,
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
                observer.error(error);
            });
        });
    }
}
exports.UserRepository = UserRepository;
