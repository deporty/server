"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMapper = void 0;
const mapper_1 = require("../../core/mapper");
const role_constants_1 = require("./role.constants");
class RoleMapper extends mapper_1.Mapper {
    constructor(firestore) {
        super();
        this.firestore = firestore;
    }
    fromJsonOverview(obj) {
        throw new Error('Method not implemented.');
    }
    fromJson(obj) {
        return {
            id: obj['id'],
            description: obj['description'] || '',
            name: obj['name'],
        };
    }
    fromJsonWithOutId(obj) {
        throw new Error('Method not implemented.');
    }
    toJson(player) {
        throw new Error('Method not implemented.');
    }
    toReferenceJson(obj) {
        return this.firestore.collection(role_constants_1.ROLES_ENTITY).doc(obj.id);
    }
    fromReferenceJson(obj) {
        throw new Error('Method not implemented.');
    }
}
exports.RoleMapper = RoleMapper;
