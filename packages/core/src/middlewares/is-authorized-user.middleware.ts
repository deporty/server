import { IBaseResponse } from '@deporty-org/entities';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export class IsAuthorizedUserMiddleware {
  constructor(private flag: boolean) {}

  getValidator(identifier: string, secret: string) {
    return async (request: Request, response: Response, next: NextFunction) => {
      if (this.flag) {
        const token = request.header('User-Token');
        if (token) {
          const JWDData: any = this.getJWTData(token, secret);
          if (JWDData) {
            const isAuthorized = this.isAuthorized(
              JWDData['resources'],
              identifier
            );

            if (isAuthorized) {
              next();
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
            response
              .json({
                meta: {
                  code: 'AUTHORIZATION:ERROR',
                },
              } as IBaseResponse<void>)
              .status(401);
          }
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

  private getJWTData(token: string, secret: string) {
    try {
      const decoded = verify(token, secret);
      return decoded;
    } catch (error) {
      return null;
    }
  }
  private isAuthorized(resources: any[], identifier: string) {
    if (!resources) return false;
    return resources.filter((x) => x.name == identifier).length > 0;
  }
}
