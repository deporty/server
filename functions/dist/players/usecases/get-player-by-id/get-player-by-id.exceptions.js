"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDoesNotExistError = void 0;
class PlayerDoesNotExistError extends Error {
    constructor(id) {
        super(`The player with the id ${id} does not exist.`);
        this.name = 'PlayerDoesNotExistError';
    }
}
exports.PlayerDoesNotExistError = PlayerDoesNotExistError;
