"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAuthorizedUserMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class IsAuthorizedUserMiddleware {
    constructor(flag) {
        this.flag = flag;
    }
    getValidator(identifier, secret) {
        return async (request, response, next) => {
            if (this.flag) {
                const token = request.header('User-Token');
                if (token) {
                    const JWDData = this.getJWTData(token, secret);
                    if (JWDData) {
                        const isAuthorized = this.isAuthorized(JWDData['resources'], identifier);
                        if (isAuthorized) {
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
    getJWTData(token, secret) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, secret);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    isAuthorized(resources, identifier) {
        if (!resources)
            return false;
        return resources.filter((x) => x.name == identifier).length == 1;
    }
}
exports.IsAuthorizedUserMiddleware = IsAuthorizedUserMiddleware;
