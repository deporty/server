"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsKeyPresentMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const secret = 'mi_clave_secreta'; // Reemplaza esto con tu clave secreta
class IsKeyPresentMiddleware {
    constructor(usecase) {
        this.usecase = usecase;
    }
    validateJWT(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, secret);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    validate() {
        return (request, response, next) => {
            const token = request.header('authorization-token');
            if (!token) {
                return response
                    .json({
                    meta: {
                        code: 'AUTHORIZATION:ERROR',
                    },
                })
                    .status(401);
            }
            const JWDData = this.validateJWT(token);
            if (!JWDData) {
                return response
                    .json({
                    meta: {
                        code: 'AUTHORIZATION:ERROR',
                    },
                })
                    .status(401);
            }
            if (JWDData) {
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
