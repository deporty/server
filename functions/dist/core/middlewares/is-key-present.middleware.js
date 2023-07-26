"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsKeyPresentMiddleware = void 0;
class IsKeyPresentMiddleware {
    constructor(usecase, flag) {
        this.usecase = usecase;
        this.flag = flag;
    }
    getValidator() {
        return async (request, response, next) => {
            var _a;
            if (this.flag) {
                const key = (_a = request.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (key) {
                    const isValid = await this.usecase(key).toPromise();
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
            }
            else {
                next();
            }
        };
    }
}
exports.IsKeyPresentMiddleware = IsKeyPresentMiddleware;
