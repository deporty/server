import { Id, IntergroupMatchEntity } from '@deporty-org/entities';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  teamAId: Id;
  teamBId: Id;
}

export class GetIntergroupMatchByTeamIdsUsecase extends Usecase<
  Param,
  IntergroupMatchEntity | undefined
> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }
  call(param: Param): Observable<IntergroupMatchEntity | undefined> {
    const $matchA = this.intergroupMatchContract.filter(
      {
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
      },
      {
        teamAId: {
          operator: '=',
          value: param.teamAId,
        },
        teamBId: {
          operator: '=',
          value: param.teamBId,
        },
      }
    );
    const $matchB = this.intergroupMatchContract.filter(
      {
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
      },
      {
        teamBId: {
          operator: '=',
          value: param.teamAId,
        },
        teamAId: {
          operator: '=',
          value: param.teamBId,
        },
      }
    );

    const $zipped = zip($matchA, $matchB).pipe(
      map(([first, second]) => {
        const res = [...first, ...second];
        return res.pop();
      })
    );
    return $zipped;
  }
}
