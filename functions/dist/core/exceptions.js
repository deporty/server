"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableNotDefinedException = exports.EmptyAttributeError = exports.EmptyStringException = void 0;
class EmptyStringException extends Error {
    constructor(property) {
        super();
        this.message = `The ${property} is empty.`;
        this.name = "EmptyStringException";
    }
}
exports.EmptyStringException = EmptyStringException;
class EmptyAttributeError extends Error {
    constructor(property) {
        super();
        this.message = `The ${property} attribute is empty.`;
        this.name = "EmptyAttributeError";
    }
}
exports.EmptyAttributeError = EmptyAttributeError;
class VariableNotDefinedException extends Error {
    constructor(property) {
        super();
        this.message = `The ${property} is not defined.`;
        this.name = "VariableNotDefinedException";
    }
}
exports.VariableNotDefinedException = VariableNotDefinedException;
