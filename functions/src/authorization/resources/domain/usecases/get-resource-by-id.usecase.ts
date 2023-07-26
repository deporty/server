import { ResourceEntity } from '@deporty-org/entities/authorization';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { ResourceContract } from '../resource.contract';

export class ResourceDoesNotExistException extends Error {
  constructor(email: string) {
    super();
    this.message = `The resource with the id "${email}" does not exist.`;
    this.name = 'ResourceDoesNotExistException';
  }
}

export class GetResourceByIdUsecase extends Usecase<string, ResourceEntity> {
  constructor(private resourceContract: ResourceContract) {
    super();
  }

  call(id: string): Observable<ResourceEntity> {
    return this.resourceContract.getById(id).pipe(
      mergeMap((user: ResourceEntity | undefined) => {
        if (!user) {
          return throwError(new ResourceDoesNotExistException(id));
        }
        return of(user);
      })
    );
  }
}
