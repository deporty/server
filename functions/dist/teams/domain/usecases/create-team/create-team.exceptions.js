"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAlreadyExistsException = void 0;
class TeamAlreadyExistsException extends Error {
    constructor(property) {
        super();
        this.message = `The team with the property ${property} already exists.`;
        this.name = "TeamAlreadyExistsException";
    }
}
exports.TeamAlreadyExistsException = TeamAlreadyExistsException;
