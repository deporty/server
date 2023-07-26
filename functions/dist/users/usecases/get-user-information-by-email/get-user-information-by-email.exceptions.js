"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDoesNotExistException = void 0;
class UserDoesNotExistException extends Error {
    constructor(email) {
        super();
        this.message = `The user with the email ${email} does not exist.`;
        this.name = 'UserDoesNotExistException';
    }
}
exports.UserDoesNotExistException = UserDoesNotExistException;
