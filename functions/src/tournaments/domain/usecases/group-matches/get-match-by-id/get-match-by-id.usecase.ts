import { Id, MatchEntity } from '@deporty-org/entities';
import { Usecase } from '../../../../../core/usecase';
import { Observable, of, throwError } from 'rxjs';
import { MatchContract } from '../../../contracts/match.contract';
import { mergeMap } from 'rxjs/operators';





export class MatchDoesNotExistError extends Error {
  constructor(id: string) {
    super();
    this.message = `The Match with the id ${id} does not exist`;
    this.name = 'MatchDoesNotExistError';
  }
}



export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
  matchId: Id;
}

export class GetMatchByIdUsecase extends Usecase<Param, MatchEntity> {
  constructor(private matchContract: MatchContract) {
    super();
  }

  call(param: Param): Observable<MatchEntity> {
    return this.matchContract
      .getById(
        {
          fixtureStageId: param.fixtureStageId,
          groupId: param.groupId,
          tournamentId: param.tournamentId,
          matchId: param.matchId,
        },
        param.matchId
      )
      .pipe(
        mergeMap((match: MatchEntity | undefined) => {
          if (!match) {
            return throwError(new MatchDoesNotExistError(param.matchId));
          }
          return of(match);
        })
      );
  }
}
