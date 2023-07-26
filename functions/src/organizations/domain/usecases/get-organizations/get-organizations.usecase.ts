import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { Pagination, Usecase } from '../../../../core/usecase';
import { OrganizationContract } from '../../contracts/organization.contract';

export class GetOrganizationsUsecase extends Usecase<
  Pagination,
  Array<OrganizationEntity>
> {
  constructor(private organizationContract: OrganizationContract) {
    super();
  }
  call(params: Pagination): Observable<Array<OrganizationEntity>> {

    return this.organizationContract.get({
      pageNumber: parseInt(params.pageNumber + ''),
      pageSize: parseInt(params.pageSize + ''),
    });
  }
}
