import { RoleEntity } from '@deporty-org/entities/authorization';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RoleContract } from '../role.contract';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const RoleDoesNotExistError = generateError('RoleDoesNotExistError', 'The role with the id {id} does not exist.');

export class GetRoleByIdUsecase extends Usecase<string, RoleEntity> {
  constructor(private roleContract: RoleContract) {
    super();
  }

  call(id: string): Observable<RoleEntity> {
    return this.roleContract.getById(id).pipe(
      mergeMap((user: RoleEntity | undefined) => {
        if (!user) {
          return throwError(new RoleDoesNotExistError({id}));
        }
        return of(user);
      })
    );
  }
}
