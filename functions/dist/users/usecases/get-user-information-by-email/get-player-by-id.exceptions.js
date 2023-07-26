"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDoesNotExistException = void 0;
class PlayerDoesNotExistException extends Error {
    constructor(id) {
        super();
        this.message = `The player with the id ${id} does not exist.`;
        this.name = 'PlayerDoesNotExistException';
    }
}
exports.PlayerDoesNotExistException = PlayerDoesNotExistException;
