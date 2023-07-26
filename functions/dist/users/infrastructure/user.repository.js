"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../core/helpers");
const user_contract_1 = require("../domain/user.contract");
const user_constants_1 = require("./user.constants");
class UserRepository extends user_contract_1.UserContract {
    constructor(firestore, userMapper) {
        super();
        this.firestore = firestore;
        this.userMapper = userMapper;
    }
    getByFullName(names, lastNames) {
        let col = this.firestore.collection(user_constants_1.USERS_ENTITY).where('name', '!=', '');
        if (names) {
            col = col.where('name', '==', names);
        }
        if (lastNames) {
            col = col.where('last-name', '==', lastNames);
        }
        return (0, rxjs_1.from)(col.get()).pipe((0, operators_1.map)((x) => {
            return x.docs.map((y) => {
                return Object.assign(Object.assign({}, y.data()), { id: y.id });
            });
        }), (0, operators_1.map)((x) => {
            if (x) {
                return x.map((y) => this.userMapper.fromJson(y));
            }
            return undefined;
        }));
    }
    update(user) {
        return (0, rxjs_1.from)(this.firestore
            .collection(user_constants_1.USERS_ENTITY)
            .doc(user.id)
            .update(this.userMapper.toJson(user))).pipe((0, operators_1.map)((x) => {
            return user;
        }));
    }
    getById(id) {
        return (0, rxjs_1.from)(this.firestore.collection(user_constants_1.USERS_ENTITY).doc(id).get()).pipe((0, operators_1.map)((data) => (0, helpers_1.unifyData)(data)), (0, operators_1.map)((data) => {
            if (!!data) {
                return this.userMapper.fromReferenceJson(data);
            }
            else {
                return (0, rxjs_1.of)(undefined);
            }
        }), (0, operators_1.mergeMap)((x) => x));
    }
    getByEmail(email) {
        const query = this.firestore
            .collection(user_constants_1.USERS_ENTITY)
            .where('email', '==', email)
            .get();
        return (0, helpers_1.mapFromSnapshot)(query, (x) => this.userMapper.fromJson(x)).pipe((0, operators_1.map)((data) => {
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
