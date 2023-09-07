import { NextFunction, Request, Response } from 'express';
export declare class IsAuthorizedUserMiddleware {
    private flag;
    constructor(flag: boolean);
    getValidator(identifier: string, secret: string): (request: Request, response: Response, next: NextFunction) => Promise<void>;
    private getJWTData;
    private isAuthorized;
}
