"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalDirectorMapper = void 0;
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../core/helpers");
const mapper_1 = require("../../core/mapper");
class TechnicalDirectorMapper extends mapper_1.Mapper {
    constructor(userMapper) {
        super();
        this.userMapper = userMapper;
    }
    fromJsonOverview(obj) {
        throw new Error('Method not implemented.');
    }
    fromReferenceJson(obj) {
        return this.mapInsideReferences(obj).pipe((0, operators_1.map)((x) => {
            const response = this.fromJson(x);
            return response;
        }));
    }
    fromJson(obj) {
        console.log("jeept");
        console.log(obj);
        return {
            initDate: obj['init-date']
                ? (0, helpers_1.getDateFromSeconds)(obj['init-date']['_seconds'])
                : undefined,
            retirementDate: !!obj['retirement-date']
                ? (0, helpers_1.getDateFromSeconds)(parseInt(obj['retirement-date']['_seconds']))
                : undefined,
            user: this.userMapper.fromJson(obj['user']),
        };
    }
    fromJsonWithOutId(obj) {
        throw new Error('Method not implemented.');
    }
    toJson(member) {
        const obj = {
            'retirement-date': member.retirementDate,
            'init-date': member.initDate,
            user: this.userMapper.toReferenceJson(member.user),
        };
        return obj;
    }
    toReferenceJson(member) {
        const obj = {
            'retirement-date': member.retirementDate,
            'init-date': member.initDate,
        };
        return obj;
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
exports.TechnicalDirectorMapper = TechnicalDirectorMapper;
