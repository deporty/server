"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamWasAlreadyRegistered = void 0;
class TeamWasAlreadyRegistered extends Error {
    constructor(name) {
        super();
        this.message = `The team ${name} was already registered`;
        this.name = 'TeamWasAlreadyRegistered';
    }
}
exports.TeamWasAlreadyRegistered = TeamWasAlreadyRegistered;
//# sourceMappingURL=add-team-to-tournament.constants.js.map