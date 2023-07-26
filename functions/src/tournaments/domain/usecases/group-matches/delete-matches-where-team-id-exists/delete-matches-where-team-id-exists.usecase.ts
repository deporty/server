import { Id, MatchEntity } from '@deporty-org/entities';
import { Usecase } from '../../../../../core/usecase';
import { Observable, of, zip } from 'rxjs';
import { GetGroupMatchesUsecase } from '../get-group-matches/get-group-matches.usecase';
import { mergeMap } from 'rxjs/operators';
import { DeleteMatchByIdUsecase } from '../delete-match-by-id/delete-match-by-id.usecase';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;

  teamId: Id;
}

export class DeleteMatchesWhereTeamIdExistsUsecase extends Usecase<
  Param,
  MatchEntity[]
> {
  constructor(
    private getGroupMatchesUsecase: GetGroupMatchesUsecase,
    private deleteMatchByIdUsecase: DeleteMatchByIdUsecase
  ) {
    super();
  }

  call(param: Param): Observable<MatchEntity[]> {
    return this.getGroupMatchesUsecase
      .call({
        fixtureStageId: param.fixtureStageId,
        groupId: param.groupId,
        tournamentId: param.tournamentId,
        states: ['completed', 'editing', 'published'],
      })
      .pipe(
        mergeMap((matches: MatchEntity[]) => {
          const matchesWhereExists = [];
          for (const match of matches) {
            if (
              match.teamAId == param.teamId ||
              match.teamBId == param.teamId
            ) {
              matchesWhereExists.push(match);
            }
          }

          return of(matchesWhereExists);
        }),
        mergeMap((matches: MatchEntity[]) => {
          const deleted = [];

          for (const match of matches) {
            deleted.push(
              this.deleteMatchByIdUsecase.call({
                fixtureStageId: param.fixtureStageId,
                groupId: param.groupId,
                matchId: match.id!,
                tournamentId: param.tournamentId,
              })
            );
          }

          return deleted.length == 0 ? of([]) : zip(...deleted);
        })
      );
  }
}
