import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { OrganizationContract } from '../../contracts/organization.contract';
import { Id } from '@deporty-org/entities';

export class OrganizationNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'OrganizationNotFoundError';
    this.message = `The organization was not found.`;
  }
}

export class GetOrganizationByIdUsecase extends Usecase<
  Id,
  OrganizationEntity
> {
  constructor(private organizationContract: OrganizationContract) {
    super();
  }
  call(id: Id): Observable<OrganizationEntity> {
    return this.organizationContract.getById(id).pipe(
      mergeMap((organization: OrganizationEntity | undefined) => {
        if (!organization) {
          return throwError(new OrganizationNotFoundError());
        }
        return of(organization);
      })
    );
  }
}
