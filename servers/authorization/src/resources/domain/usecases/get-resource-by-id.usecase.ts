import { ResourceEntity } from '@deporty-org/entities/authorization';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ResourceContract } from '../resource.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const ResourceDoesNotExistError = generateError(
  'ResourceDoesNotExistError',
  'The resource with the id "${id}" does not exist.'
);

export class GetResourceByIdUsecase extends Usecase<string, ResourceEntity> {
  constructor(private resourceContract: ResourceContract) {
    super();
  }

  call(id: string): Observable<ResourceEntity> {
    return this.resourceContract.getById(id).pipe(
      mergeMap((user: ResourceEntity | undefined) => {
        if (!user) {
          return throwError(new ResourceDoesNotExistError({id}));
        }
        return of(user);
      })
    );
  }
}
