"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredTeamMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../../core/mapper");
class RegisteredTeamMapper extends mapper_1.Mapper {
    constructor(memberMapper) {
        super();
        this.memberMapper = memberMapper;
        this.attributesMapper = {
            tournamentId: { name: "tournament-id" },
            id: { name: "id" },
            enrollmentDate: {
                name: "enrollment-date",
                from: (date) => {
                    return date ? (0, rxjs_1.of)(date.toDate()) : (0, rxjs_1.of)(undefined);
                },
            },
            members: {
                name: "members",
                from: (members) => {
                    return members.length > 0
                        ? (0, rxjs_1.zip)(...members.map((element) => {
                            return this.memberMapper.fromJson(element);
                        }))
                        : (0, rxjs_1.of)([]);
                },
                to: (members) => {
                    return members.length > 0
                        ? members.map((element) => {
                            return this.memberMapper.toJson(element);
                        })
                        : [];
                },
            },
            teamId: { name: "team-id" },
            status: { name: "status" },
        };
    }
}
exports.RegisteredTeamMapper = RegisteredTeamMapper;
