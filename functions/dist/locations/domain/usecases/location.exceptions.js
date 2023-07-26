"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationDoesNotExistError = void 0;
class LocationDoesNotExistError extends Error {
    constructor(id) {
        super();
        this.message = `The location with the id ${id} does not exist`;
        this.name = 'LocationDoesNotExistError';
    }
}
exports.LocationDoesNotExistError = LocationDoesNotExistError;
