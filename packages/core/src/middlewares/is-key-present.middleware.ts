// import { IBaseResponse } from '@deporty-org/entities';
import { IBaseResponse } from '@deporty-org/entities';
import { NextFunction, Request, Response } from 'express';
import { Observable } from 'rxjs';

export class IsKeyPresentMiddleware {
  constructor(
    protected usecase: (key: string) => Observable<boolean>,
    protected flag: boolean
  ) {}

  getValidator() {
    return async (request: Request, response: Response, next: NextFunction) => {
      if (this.flag) {
        const key = request.header('Authorization')?.split(' ')[1];

        if (key) {
          // const isValid = await this.usecase(key).toPromise();

          next();
          // if (isValid) {
          // } else {
          //   response
          //     .json({
          //       meta: {
          //         code: 'AUTHORIZATION:ERROR',
          //       },
          //     } as IBaseResponse<void>)
          //     .status(401);
          // }
        } else {
          response
            .json({
              meta: {
                code: 'AUTHORIZATION:ERROR',
              },
            } as IBaseResponse<void>)
            .status(401);
        }
      } else {
        next();
      }
    };
  }
}
