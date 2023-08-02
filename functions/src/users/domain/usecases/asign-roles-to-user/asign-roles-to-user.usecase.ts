import { Id } from '@deporty-org/entities';
import { RoleEntity } from '@deporty-org/entities/authorization';
import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { AuthorizationContract } from '../../contracts/authorization.contract';
import { UserContract } from '../../contracts/user.contract';
import { GetUserByIdUsecase } from '../get-user-by-id/get-user-by-id.usecase';

export interface RoleUserAggregate {
  rolesIds: string[];
  userId: string;
}
export class AsignRolesToUserUsecase extends Usecase<
  RoleUserAggregate,
  UserEntity
> {
  constructor(
    private getUserByIdUsecase: GetUserByIdUsecase,
    private authorizationContract: AuthorizationContract,
    private userContract: UserContract
  ) {
    super();
  }

  call(params: RoleUserAggregate): Observable<UserEntity> {
    return this.getUserByIdUsecase.call(params.userId).pipe(
      mergeMap((user: UserEntity) => {
        const $roles = !!params.rolesIds.length
          ? zip(
              ...params.rolesIds.map((x) =>
                this.authorizationContract.getRoleById(x)
              )
            )
          : of([]);
        return zip($roles, of(user));
      }),
      map((data) => {
        const newRoles: RoleEntity[] = data[0];
        const user: UserEntity = data[1];

        for (const newRole of newRoles) {
          const exists =
            user.roles.filter((roleId: Id) => {
              return newRole.id === roleId;
            }).length > 0;

          if (!exists) {
            user.roles.push(newRole.id!!);
          }
        }
        return user;
      }),
      mergeMap((user: UserEntity) => {
        return this.userContract.update(user.id as string, user);
      })
    );
  }
}
