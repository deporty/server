import { MemberEntity } from '@deporty-org/entities/teams';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { MemberContract } from '../../contracts/member.contract';

export interface Param {
  teamId: string;
  includeRetired: boolean;
}

export class GetOnlyMembersByTeamUsecase extends Usecase<Param, Array<MemberEntity>> {
  constructor(private memberContract: MemberContract) {
    super();
  }

  call(param: Param): Observable<Array<MemberEntity>> {
    const { teamId, includeRetired } = param;
    const filters: Filters = {
      teamId: {
        operator: '==',
        value: teamId,
      },
    };
    if(!includeRetired) {
      filters['retirementDate'] = {
        operator: '!=',
        value: null
      }
    }


    return this.memberContract.filter(
      {
        teamId,
      },
      filters
    );
  }
}
