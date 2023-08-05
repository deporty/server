import { Observable, of, zip } from 'rxjs';
import { Usecase } from '../../../../core/usecase';
import { GetAllowedResourcesByRoleIdsUsecase } from '../get-allowed-resources-by-role-ids/get-allowed-resources-by-role-ids.usecase';
import { UserContract } from '../../contracts/user.constract';
import { map, mergeMap } from 'rxjs/operators';
import { UserEntity } from '@deporty-org/entities';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../../infrastructure/authorization.constants';
import moment = require('moment');

export class GetTokenUsecase extends Usecase<string, string> {
  constructor(
    private getAllowedResourcesByRoleIdsUsecase: GetAllowedResourcesByRoleIdsUsecase,
    private userContract: UserContract
  ) {
    super();
  }
  call(email: string): Observable<string> {
    console.log("checho")
    return this.userContract.getUserInformationByEmail(email).pipe(
      mergeMap((user: UserEntity) => {
        return zip(
          of(user),
          this.getAllowedResourcesByRoleIdsUsecase.call(user.roles)
        );
      }),
      map(([user, resources]) => {
        const payload = {
          user,
          resources,
          exp: moment().add(1,'hour').unix(),
        };
        const token = sign(payload, JWT_SECRET);
        return token;
      })
    );
  }
}
