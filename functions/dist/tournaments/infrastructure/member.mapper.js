"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberMapper = void 0;
const helpers_1 = require("../../core/helpers");
const mapper_1 = require("../../core/mapper");
class MemberMapper extends mapper_1.Mapper {
    constructor(playerMapper) {
        super();
        this.playerMapper = playerMapper;
    }
    fromJson(obj) {
        return {
            name: obj['name'],
            lastName: obj['last-name'],
            id: obj['id'],
            document: obj['document'],
            alias: obj['alias'],
            number: obj['number'],
            role: obj['role'],
            image: obj['image'],
            phone: obj['phone'],
            email: obj['email'],
            initDate: !!obj['init-date']
                ? (0, helpers_1.getDateFromSeconds)(obj['init-date']['_seconds'])
                : undefined,
            retirementDate: !!obj['retirement-date']
                ? (0, helpers_1.getDateFromSeconds)(obj['retirement-date']['_seconds'])
                : undefined,
        };
    }
    fromJsonWithOutId(obj) {
        return {
            name: obj['name'],
            lastName: obj['last-name'],
            document: obj['document'],
            alias: obj['alias'],
            number: obj['number'],
            role: obj['role'],
            image: obj['image'],
            email: obj['email'],
            phone: obj['phone'],
        };
    }
    toJson(player) {
        return {
            name: player.name,
            'last-name': player.lastName || '',
            document: player.document,
            alias: player.alias || '',
            number: player.number || '',
            role: player.role || '',
            email: player.email || '',
            phone: player.phone || '',
            image: player.image || '',
        };
    }
    toReferenceJson(member) {
        return {
            'retirement-date': member.retirementDate,
            'init-date': member.initDate,
            role: member.role,
            player: this.playerMapper.toReferenceJson(member),
        };
    }
    toFullJson(player) {
        return {
            name: player.name,
            'last-name': player.lastName || '',
            document: player.document,
            alias: player.alias || '',
            number: player.number || '',
            role: player.role || '',
            email: player.email || '',
            phone: player.phone || '',
            image: player.image || '',
        };
    }
}
exports.MemberMapper = MemberMapper;
