"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../core/helpers");
const role_contract_1 = require("../domain/role.contract");
const role_constants_1 = require("./role.constants");
class RoleRepository extends role_contract_1.RoleContract {
    constructor(firestore, roleMapper) {
        super();
        this.firestore = firestore;
        this.roleMapper = roleMapper;
    }
    getById(id) {
        return (0, rxjs_1.from)(this.firestore.collection(role_constants_1.ROLES_ENTITY).doc(id).get()).pipe((0, operators_1.map)((data) => (0, helpers_1.unifyData)(data)), (0, operators_1.map)((data) => {
            if (!!data) {
                return this.roleMapper.fromJson(data);
            }
            else {
                return undefined;
            }
        }));
    }
}
exports.RoleRepository = RoleRepository;
