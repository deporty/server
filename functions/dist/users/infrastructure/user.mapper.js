"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const operators_1 = require("rxjs/operators");
const mapper_1 = require("../../core/mapper");
const user_constants_1 = require("./user.constants");
class UserMapper extends mapper_1.Mapper {
    constructor(firestore, roleMapper) {
        super();
        this.firestore = firestore;
        this.roleMapper = roleMapper;
    }
    fromJsonOverview(obj) {
        throw new Error('Method not implemented.');
    }
    fromJsonWithOutId(obj) {
        throw new Error('Method not implemented.');
    }
    fromReferenceJson(obj) {
        const mappedObj = this.mapInsideReferences(obj).pipe((0, operators_1.map)((item) => {
            return this.fromJson(item);
        }));
        return mappedObj;
    }
    fromJson(obj) {
        return {
            name: obj['name'],
            lastName: obj['last-name'],
            id: obj['id'],
            document: obj['document'],
            image: obj['image'],
            phone: obj['phone'],
            email: obj['email'],
            roles: obj['roles'] || [],
            birthDate: obj['birth-date'],
        };
    }
    toJson(player) {
        return {
            name: player.name,
            'last-name': player.lastName || '',
            document: player.document + "",
            email: player.email || '',
            phone: player.phone || '',
            image: player.image || '',
            roles: !!player.roles
                ? player.roles.map((role) => this.roleMapper.toReferenceJson(role))
                : [],
        };
    }
    toReferenceJson(user) {
        return this.firestore.collection(user_constants_1.USERS_ENTITY).doc(user.id);
    }
    toFullJson(player) {
        return {
            name: player.name,
            'last-name': player.lastName || '',
            document: player.document,
            alias: player.alias || '',
            email: player.email || '',
            phone: player.phone || '',
            image: player.image || '',
        };
    }
}
exports.UserMapper = UserMapper;
