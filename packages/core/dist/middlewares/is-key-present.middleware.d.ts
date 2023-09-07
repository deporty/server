import { NextFunction, Request, Response } from 'express';
import { Observable } from 'rxjs';
export declare class IsKeyPresentMiddleware {
    protected usecase: (key: string) => Observable<boolean>;
    protected flag: boolean;
    constructor(usecase: (key: string) => Observable<boolean>, flag: boolean);
    getValidator(): (request: Request, response: Response, next: NextFunction) => Promise<void>;
}
