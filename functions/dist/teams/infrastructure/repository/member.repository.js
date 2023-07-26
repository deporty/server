"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRepository = void 0;
const teams_constants_1 = require("../teams.constants");
const member_contract_1 = require("../../domain/contracts/member.contract");
class MemberRepository extends member_contract_1.MemberContract {
    constructor(datasource, mapper) {
        super(datasource, mapper);
        this.datasource = datasource;
        this.mapper = mapper;
    }
    delete(accessParams) {
        throw new Error('Method not implemented.');
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: teams_constants_1.TEAMS_ENTITY, id: accessParams.teamId },
            { collection: teams_constants_1.MEMBERS_ENTITY },
        ]);
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: teams_constants_1.TEAMS_ENTITY, id: accessParams.teamId },
            { collection: teams_constants_1.MEMBERS_ENTITY },
        ], pagination);
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: teams_constants_1.TEAMS_ENTITY, id: accessParams.teamId },
            { collection: teams_constants_1.MEMBERS_ENTITY, id },
        ]);
    }
    save(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
    update(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
}
exports.MemberRepository = MemberRepository;
MemberRepository.entity = teams_constants_1.MEMBERS_ENTITY;
