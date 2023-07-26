"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupDoesNotExist = exports.StageDoesNotExist = exports.MatchWasAlreadyRegistered = void 0;
class MatchWasAlreadyRegistered extends Error {
    constructor(teamA, teamB) {
        super();
        this.message = `The match with "${teamA.name}" and "${teamB.name}" was already registered`;
        this.name = 'MatchWasAlreadyRegistered';
    }
}
exports.MatchWasAlreadyRegistered = MatchWasAlreadyRegistered;
class StageDoesNotExist extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" does not have members. Add at least one member.`;
        this.name = 'StageDoesNotExist';
    }
}
exports.StageDoesNotExist = StageDoesNotExist;
class GroupDoesNotExist extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" does not have members. Add at least one member.`;
        this.name = 'GroupDoesNotExist';
    }
}
exports.GroupDoesNotExist = GroupDoesNotExist;
