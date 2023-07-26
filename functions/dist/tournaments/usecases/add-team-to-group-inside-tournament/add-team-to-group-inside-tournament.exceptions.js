"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamDoesNotHaveMembers = exports.TeamIsAlreadyInOtherGroup = exports.TeamIsAlreadyInTheGroup = void 0;
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
