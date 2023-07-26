"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchDoesNotExist = exports.GroupDoesNotExist = exports.StageDoesNotExist = exports.MatchWasAlreadyRegistered = void 0;
class MatchWasAlreadyRegistered extends Error {
    constructor(match) {
        super();
        this.message = `The match with "${match.teamA.name}" and "${match.teamB.name}" was already registered`;
        this.name = 'MatchWasAlreadyRegistered';
    }
}
exports.MatchWasAlreadyRegistered = MatchWasAlreadyRegistered;
class StageDoesNotExist extends Error {
    constructor(stageIndex) {
        super();
        this.message = `The stage with the id "${stageIndex}" does not exist`;
        this.name = 'StageDoesNotExist';
    }
}
exports.StageDoesNotExist = StageDoesNotExist;
class GroupDoesNotExist extends Error {
    constructor(groupIndex) {
        super();
        this.message = `The group with the index "${groupIndex}" does not exist.`;
        this.name = 'GroupDoesNotExist';
    }
}
exports.GroupDoesNotExist = GroupDoesNotExist;
class MatchDoesNotExist extends Error {
    constructor() {
        super();
        this.message = `The match does not exist.`;
        this.name = 'MatchDoesNotExist';
    }
}
exports.MatchDoesNotExist = MatchDoesNotExist;
