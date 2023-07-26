"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredTeamMapper = void 0;
class RegisteredTeamMapper {
    constructor(teamMapper, memberMapper) {
        this.teamMapper = teamMapper;
        this.memberMapper = memberMapper;
    }
    fromJson(obj) {
        return {
            enrollmentDate: obj['enrollment-date'],
            members: !!obj['members']
                ? obj['members'].map((x) => {
                    return this.memberMapper.fromJson(x);
                })
                : [],
            team: this.teamMapper.fromJson(obj['team']),
        };
    }
    toJson(registeredTeam) {
        const registeredTeamTemp = {
            'enrollment-date': registeredTeam.enrollmentDate,
            members: !!registeredTeam.members
                ? registeredTeam.members.map((x) => {
                    return this.memberMapper.toReferenceJson(x);
                })
                : [],
            team: this.teamMapper.toReferenceJson(registeredTeam.team),
        };
        return registeredTeamTemp;
    }
}
exports.RegisteredTeamMapper = RegisteredTeamMapper;
