"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRepository = void 0;
const member_contract_1 = require("../contracts/member.contract");
const team_constants_1 = require("../team.constants");
class MemberRepository extends member_contract_1.MemberContract {
    constructor(db, mapper) {
        super(db, mapper);
        this.db = db;
        this.mapper = mapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: team_constants_1.TEAMS_ENTITY, id: accessParams.teamId },
            { collection: team_constants_1.MEMBERS_ENTITY, id },
        ]);
    }
    delete(accessParams) {
        throw new Error('Method not implemented.');
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: team_constants_1.TEAMS_ENTITY, id: accessParams.teamId },
            { collection: team_constants_1.MEMBERS_ENTITY },
        ], pagination);
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: team_constants_1.TEAMS_ENTITY, id: accessParams.teamId },
            { collection: team_constants_1.MEMBERS_ENTITY },
        ]);
    }
    update(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
    save(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
}
exports.MemberRepository = MemberRepository;
MemberRepository.entity = team_constants_1.MEMBERS_ENTITY;
