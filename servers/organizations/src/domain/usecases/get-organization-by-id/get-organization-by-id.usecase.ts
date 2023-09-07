import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OrganizationContract } from '../../contracts/organization.contract';
import { Id } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const OrganizationNotFoundError = generateError('OrganizationNotFoundError', 'The organization was not found.');

export class GetOrganizationByIdUsecase extends Usecase<Id, OrganizationEntity> {
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
