import { PermissionEntity } from '@deporty-org/entities/authorization';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PermissionContract } from '../permission.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class PermissionDoesNotExistException extends Error {
  constructor(id: string) {
    super();
    this.message = `The permission with the id "${id}" does not exist.`;
    this.name = 'PermissionDoesNotExistException';
  }
}

export class GetPermissionByIdUsecase extends Usecase<
  string,
  PermissionEntity
> {
  constructor(private permissionContract: PermissionContract) {
    super();
  }

  call(id: string): Observable<PermissionEntity> {
    return this.permissionContract.getById(id).pipe(
      mergeMap((user: PermissionEntity | undefined) => {
        if (!user) {
          return throwError(new PermissionDoesNotExistException(id));
        }
        return of(user);
      })
    );
  }
}
