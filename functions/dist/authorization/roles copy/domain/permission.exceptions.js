"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleDoesNotExistException = void 0;
class RoleDoesNotExistException extends Error {
    constructor(email) {
        super();
        this.message = `The role with the id "${email}" does not exist.`;
        this.name = 'RoleDoesNotExistException';
    }
}
exports.RoleDoesNotExistException = RoleDoesNotExistException;
