import { Id, MatchEntity } from '@deporty-org/entities';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GetGroupByIdUsecase } from '../../groups/get-group-by-id/get-group-by-id.usecase';
import { GetGroupMatchesUsecase } from '../get-group-matches/get-group-matches.usecase';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;

  teamIds?: Id[];
}
export class GetNewMatchesToAddInGroupUsecase extends Usecase<
  Param,
  MatchEntity[]
> {
  constructor(
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private getGroupMatchesUsecase: GetGroupMatchesUsecase
  ) {
    super();
  }
  call(param: Param): Observable<any[]> {
    const $teamIds = this.getTeamIds(param);
    return $teamIds.pipe(
      mergeMap((teamIds: Id[]) => {
        return this.makeMatrix(param, teamIds);
      })
    );
  }

  private getTeamIds(param: Param): Observable<Id[]> {
    if (!param.teamIds) {
      return this.getGroupByIdUsecase
        .call({
          fixtureStageId: param.fixtureStageId,
          groupId: param.groupId,
          tournamentId: param.tournamentId,
        })
        .pipe(
          map((group) => {
            return group.teamIds;
          })
        );
    }
    return of(param.teamIds);
  }

  private areAllMatchesSetted(teamIds: Id[], matches: MatchEntity[]) {
    const allPosibleMatches = ((teamIds.length - 1) * teamIds.length) / 2;
    return matches.length === allPosibleMatches;
  }
  private makeMatrix(param: Param, teamIds: Id[]) {
    return this.getGroupMatchesUsecase
      .call({
        fixtureStageId: param.fixtureStageId,
        groupId: param.groupId,
        tournamentId: param.tournamentId,
        states: ['completed', 'editing', 'published'],
      })
      .pipe(
        mergeMap((matches: MatchEntity[]) => {
          const areAllMatchesSetted = this.areAllMatchesSetted(
            teamIds,
            matches
          );
          if (!areAllMatchesSetted) {
            const matrix = {
              teamIds,
              table: Array.from<Array<boolean>>({ length: teamIds.length }).map(
                (x) => Array.from<boolean>({ length: teamIds.length })
              ),
            };

            for (const match of matches) {
              const indexTeamA = teamIds.findIndex((t) => t == match.teamAId);
              const indexTeamB = teamIds.findIndex((t) => t == match.teamBId);

              matrix.table[indexTeamA][indexTeamB] = true;
              matrix.table[indexTeamB][indexTeamA] = true;
            }

            const newMatches: MatchEntity[] = [];

            for (let row = 1; row < teamIds.length; row++) {
              for (let column = 0; column < row; column++) {
                if (row != column) {
                  const existsMatch = matrix.table[row][column];

                  if (!existsMatch) {
                    const teamAId = matrix.teamIds[row];
                    const teamBId = matrix.teamIds[column];

                    const newMatch: MatchEntity = {
                      status: 'editing',
                      teamAId,
                      teamBId,
                    };

                    newMatches.push(newMatch);
                    matrix.table[row][column] = true;
                    matrix.table[column][row] = true;
                  }
                }
              }
            }
            return of(newMatches);
          }
          return of([]);
        })
      );
  }
}
