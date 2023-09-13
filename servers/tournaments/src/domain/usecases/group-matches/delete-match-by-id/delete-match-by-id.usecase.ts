import { Id, MatchEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { MatchContract } from '../../../contracts/match.contract';
import { GetMatchByIdUsecase } from '../get-match-by-id/get-match-by-id.usecase';
import { map, mergeMap } from 'rxjs/operators';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
  matchId: Id;
}

export class DeleteMatchByIdUsecase extends Usecase<Param, MatchEntity> {
  constructor(
    private matchContract: MatchContract,
    private getMatchByIdUsecase: GetMatchByIdUsecase
  ) {
    super();
  }

  call(param: Param): Observable<MatchEntity> {
    return this.getMatchByIdUsecase.call(param).pipe(
      mergeMap((match) => {
        return this.matchContract
          .delete(param, param.matchId)
          .pipe(map((x) => match));
      })
    );
  }
}
