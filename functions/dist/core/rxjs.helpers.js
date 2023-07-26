"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAndThrow = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function catchAndThrow() {
    return (0, operators_1.catchError)((x) => {
        return (0, rxjs_1.throwError)(x);
    });
}
exports.catchAndThrow = catchAndThrow;
