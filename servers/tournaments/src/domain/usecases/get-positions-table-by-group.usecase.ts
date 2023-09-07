import { Id, PointsStadistics } from '@deporty-org/entities';
import { Observable, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetPositionsTableUsecase } from './get-positions-table.usecase';
import { GetGroupMatchesUsecase } from './group-matches/get-group-matches/get-group-matches.usecase';
import { GetIntergroupMatchesUsecase } from './intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase';
import { GetGroupByIdUsecase } from './groups/get-group-by-id/get-group-by-id.usecase';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
}
export class GetPositionsTableByGroupUsecase extends Usecase<
  Param,
  PointsStadistics[]
> {
  constructor(
    private getGroupMatchesUsecase: GetGroupMatchesUsecase,
    private getPositionsTableUsecase: GetPositionsTableUsecase,
    private getIntergroupMatchesUsecase: GetIntergroupMatchesUsecase,
    private getGroupByIdUsecase: GetGroupByIdUsecase
  ) {
    super();
  }

  call(param: Param): Observable<PointsStadistics[]> {
    return zip(
      this.getGroupByIdUsecase.call(param),
      this.getGroupMatchesUsecase.call({
        ...param,
        states: ['completed'],
      }),
      this.getIntergroupMatchesUsecase.call({
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
        states: ['completed'],
      })
    ).pipe(
      mergeMap(([group, matches, intergroupMatches]) => {
        const fullMatches = [...matches];

        for (const inter of intergroupMatches) {
          if (
            group.teamIds.includes(inter.match.teamAId) ||
            group.teamIds.includes(inter.match.teamBId)
          ) {
            fullMatches.push(inter.match);
          }
        }

        return this.getPositionsTableUsecase.call({
          matches: fullMatches,
          teamIds: group.teamIds,
        });
      })
    );
  }
}
