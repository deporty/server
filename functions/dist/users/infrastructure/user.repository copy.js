"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../core/helpers");
const user_contract_1 = require("../user.contract");
const user_constants_1 = require("./user.constants");
class UserRepository extends user_contract_1.UserContract {
    constructor(dataSource, firestore, userMapper) {
        super();
        this.dataSource = dataSource;
        this.firestore = firestore;
        this.userMapper = userMapper;
    }
    getById(id) {
        return (0, rxjs_1.from)(this.firestore.collection(user_constants_1.USERS_ENTITY).doc(id).get()).pipe((0, operators_1.map)((data) => (0, helpers_1.unifyData)(data)), (0, operators_1.map)((data) => {
            if (!!data) {
                return this.userMapper.fromJson(data);
            }
            else {
                return undefined;
            }
        }));
    }
    getByEmail(email) {
        this.dataSource.entity = user_constants_1.USERS_ENTITY;
        return this.dataSource
            .getByFilter([
            {
                property: 'email',
                equals: email,
            },
        ])
            .pipe((0, operators_1.map)((data) => {
            if (data && data.length > 0) {
                return data[0];
            }
            else {
                return null;
            }
        }));
    }
}
exports.UserRepository = UserRepository;
