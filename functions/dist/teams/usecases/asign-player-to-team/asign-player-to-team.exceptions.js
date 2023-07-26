"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerIsAlreadyInTeamException = void 0;
class PlayerIsAlreadyInTeamException extends Error {
    constructor(property) {
        super();
        this.message = `The player with the document ${property} already exists in the team`;
        this.name = 'PlayerIsAlreadyInTeam';
    }
}
exports.PlayerIsAlreadyInTeamException = PlayerIsAlreadyInTeamException;
