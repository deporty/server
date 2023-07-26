"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamDoesNotExistError = void 0;
class TeamDoesNotExistError extends Error {
    constructor(id) {
        super(`The team with the id ${id} does not exist`);
        this.name = 'TeamDoesNotExistError';
    }
}
exports.TeamDoesNotExistError = TeamDoesNotExistError;
