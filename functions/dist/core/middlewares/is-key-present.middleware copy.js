"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsKeyPresentMiddleware = void 0;
class IsKeyPresentMiddleware {
    constructor(usecase) {
        this.usecase = usecase;
    }
    validate() {
        return (request, response, next) => {
            var _a;
            const key = (_a = request.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            const isValid = this.usecase(key);
            if (isValid) {
                next();
            }
            else {
                response
                    .json({
                    meta: {
                        code: 'AUTHORIZATION:ERROR',
                    },
                })
                    .status(401);
            }
        };
    }
}
exports.IsKeyPresentMiddleware = IsKeyPresentMiddleware;
