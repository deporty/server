import { RoleEntity } from '@deporty-org/entities/authorization';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RoleContract } from '../role.contract';
import { RoleDoesNotExistException } from '../role.exceptions';
import { Usecase } from '../../../../core/usecase';

export class GetRoleByIdUsecase extends Usecase<string, RoleEntity> {
  constructor(private roleContract: RoleContract) {
    super();
  }

  call(id: string): Observable<RoleEntity> {
    return this.roleContract.getById(id).pipe(
      mergeMap((user: RoleEntity | undefined) => {
        if (!user) {
          return throwError(new RoleDoesNotExistException(id));
        }
        return of(user);
      })
    );
  }
}
