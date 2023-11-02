import { Id, IntergroupMatchEntity, MatchStatusType } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';
import { map } from 'rxjs/operators';

export interface Param {
  fixtureStageId: Id;
  tournamentId: Id;
  groupId: Id;
  states: MatchStatusType[];
}

export class GetIntergroupMatchesByGroupIdUsecase extends Usecase<Param, IntergroupMatchEntity[]> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }

  call(param: Param): Observable<IntergroupMatchEntity[]> {
    return this.intergroupMatchContract
      .filter(
        {
          tournamentId: param.tournamentId,
          fixtureStageId: param.fixtureStageId,
        },
        {
          or: {
            teamAGroupId: {
              operator: '==',
              value: param.groupId,
            },
            teamBGroupId: {
              operator: '==',
              value: param.groupId,
            },
          },
        }
      )
      .pipe(
        map((matches) => {
          return matches.filter((match) => param.states.includes(match.match.status));
        })
      );
  }
}
