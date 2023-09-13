import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { GetOrganizationWhereExistsMemberIdUsecase } from './get-organization-where-exists-member-id.usecase';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../contracts/user.constract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetOrganizationWhereExistsMemberEmailUsecase extends Usecase<string, Array<OrganizationEntity> | undefined> {
  constructor(
    private userContract: UserContract,
    private getOrganizationWhereExistsMemberIdUsecase: GetOrganizationWhereExistsMemberIdUsecase
  ) {
    super();
  }
  call(email: string): Observable<Array<OrganizationEntity> | undefined> {
    return this.userContract.getUserInformationByEmail(email).pipe(
      mergeMap((user) => {
        return this.getOrganizationWhereExistsMemberIdUsecase.call(user.id as string);
      })
    );
  }
}
