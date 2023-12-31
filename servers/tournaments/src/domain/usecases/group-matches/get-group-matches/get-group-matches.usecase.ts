import { MatchStatusType, Id, MatchEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { MatchContract } from '../../../contracts/match.contract';

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  states: MatchStatusType[];
  tournamentId: Id;
}

export class GetGroupMatchesUsecase extends Usecase<Param, Array<MatchEntity>> {
  constructor(private matchContract: MatchContract) {
    super();
  }

  call(param: Param): Observable<MatchEntity[]> {
    const filters: Filters = {
      status: {
        operator: 'in',
        value: param.states || ['published'],
      },
    };
    return this.matchContract.filter(
      {
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
        groupId: param.groupId,
      },
      filters
    );
  }
}
