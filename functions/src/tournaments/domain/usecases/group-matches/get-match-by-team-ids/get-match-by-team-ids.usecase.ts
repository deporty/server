import { Id, MatchEntity } from '@deporty-org/entities';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { MatchContract } from '../../../contracts/match.contract';

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  teamAId: Id;
  teamBId: Id;
  tournamentId: Id;
}

export class GetMatchByTeamIdsUsecase extends Usecase<Param, MatchEntity | undefined> {
  constructor(private matchContract: MatchContract) {
    super();
  }

  call(param: Param): Observable<MatchEntity | undefined> {
    const $matchA = this.matchContract.filter(
      {
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
        groupId: param.groupId,
      },
      {
        teamAId: {
          operator: '==',
          value: param.teamAId,
        },
        teamBId: {
          operator: '==',
          value: param.teamBId,
        },
      }
    );

    const $matchB = this.matchContract.filter(
      {
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
        groupId: param.groupId,
      },
      {
        teamBId: {
          operator: '==',
          value: param.teamAId,
        },
        teamAId: {
          operator: '==',
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
