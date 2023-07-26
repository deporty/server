import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { Usecase } from '../../../core/usecase';
import { OrganizationContract } from '../contracts/organization.contract';

export class GetOrganizationWhereExistsMemberIdUsecase extends Usecase<
  string,
  Array<OrganizationEntity> | undefined
> {
  constructor(private organizationContract: OrganizationContract) {
    super();
  }
  call(memberid: string): Observable<Array<OrganizationEntity> | undefined> {
    return this.organizationContract.filter({
      members: {
        operator: 'array-contains',
        value: memberid,
      },
    });
  }
}
