import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { OrganizationContract } from '../../contracts/organization.contract';
import { Pagination, Usecase } from '@scifamek-open-source/iraca/domain';

export class GetOrganizationsUsecase extends Usecase<Pagination, Array<OrganizationEntity>> {
  constructor(private organizationContract: OrganizationContract) {
    super();
  }
  call(params: Pagination): Observable<Array<OrganizationEntity>> {
    return this.organizationContract.get(params);
  }
}
