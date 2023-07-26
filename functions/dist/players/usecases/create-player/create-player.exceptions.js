"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAlreadyExistsException = void 0;
class PlayerAlreadyExistsException extends Error {
    constructor(property) {
        super();
        this.message = `The player with the property ${property} already exists.`;
        this.name = "PlayerAlreadyExistsException";
    }
}
exports.PlayerAlreadyExistsException = PlayerAlreadyExistsException;
