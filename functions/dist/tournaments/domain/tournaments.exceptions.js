"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentDoesNotExistError = exports.MatchDoesNotExist = exports.TeamWasAlreadyRegistered = exports.TeamDoesNotHaveMembers = exports.TeamIsAlreadyInOtherGroup = exports.TeamIsAlreadyInTheGroup = exports.OrderMustBeProvidedError = exports.LabelMustBeProvidedError = exports.GroupAlreadyExistsError = exports.GroupDoesNotExist = exports.StageDoesNotExist = exports.MatchWasAlreadyRegistered = void 0;
class MatchWasAlreadyRegistered extends Error {
    constructor(match) {
        super();
        this.message = `The match with "${match.teamAId}" and "${match.teamBId}" was already registered`;
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
    constructor(value, property = 'id') {
        super();
        this.message = `The group with the ${property} "${value}" does not exist.`;
        this.name = 'GroupDoesNotExist';
    }
}
exports.GroupDoesNotExist = GroupDoesNotExist;
class GroupAlreadyExistsError extends Error {
    constructor(value, property = 'id') {
        super();
        this.message = `The group with the ${property} "${value}" already exists.`;
        this.name = 'GroupAlreadyExistsError';
    }
}
exports.GroupAlreadyExistsError = GroupAlreadyExistsError;
class LabelMustBeProvidedError extends Error {
    constructor() {
        super();
        this.message = `The label was not provided.`;
        this.name = 'LabelMustBeProvidedError';
    }
}
exports.LabelMustBeProvidedError = LabelMustBeProvidedError;
class OrderMustBeProvidedError extends Error {
    constructor() {
        super();
        this.message = `The order was not provided.`;
        this.name = 'OrderMustBeProvidedError';
    }
}
exports.OrderMustBeProvidedError = OrderMustBeProvidedError;
class TeamIsAlreadyInTheGroup extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" is already in the group`;
        this.name = 'TeamIsAlreadyInTheGroup';
    }
}
exports.TeamIsAlreadyInTheGroup = TeamIsAlreadyInTheGroup;
class TeamIsAlreadyInOtherGroup extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" is already in other group`;
        this.name = 'TeamIsAlreadyInOtherGroup';
    }
}
exports.TeamIsAlreadyInOtherGroup = TeamIsAlreadyInOtherGroup;
class TeamDoesNotHaveMembers extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" does not have members. Add at least one member.`;
        this.name = 'TeamDoesNotHaveMembers';
    }
}
exports.TeamDoesNotHaveMembers = TeamDoesNotHaveMembers;
class TeamWasAlreadyRegistered extends Error {
    constructor(name) {
        super();
        this.message = `The team "${name}" was already registered`;
        this.name = 'TeamWasAlreadyRegistered';
    }
}
exports.TeamWasAlreadyRegistered = TeamWasAlreadyRegistered;
class MatchDoesNotExist extends Error {
    constructor() {
        super();
        this.message = `The match does not exist.`;
        this.name = 'MatchDoesNotExist';
    }
}
exports.MatchDoesNotExist = MatchDoesNotExist;
class TournamentDoesNotExistError extends Error {
    constructor(id) {
        super();
        this.message = `The tournament with the id ${id} does not exist`;
        this.name = 'TournamentDoesNotExistError';
    }
}
exports.TournamentDoesNotExistError = TournamentDoesNotExistError;
