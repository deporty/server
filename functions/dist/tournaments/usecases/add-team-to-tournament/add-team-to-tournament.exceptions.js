"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamDoesNotHaveMembers = exports.TeamWasAlreadyRegistered = void 0;
class TeamWasAlreadyRegistered extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" was already registered`;
        this.name = 'TeamWasAlreadyRegistered';
    }
}
exports.TeamWasAlreadyRegistered = TeamWasAlreadyRegistered;
class TeamDoesNotHaveMembers extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" does not have members. Add at least one member.`;
        this.name = 'TeamDoesNotHaveMembers';
    }
}
exports.TeamDoesNotHaveMembers = TeamDoesNotHaveMembers;
