import {
  FixtureStageEntity,
  GroupEntity,
  MatchStatusType,
  MatchEntity,
} from '@deporty-org/entities/tournaments';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetFixtureStagesByTournamentUsecase } from '../fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase';
import { GetGroupMatchesUsecase } from '../group-matches/get-group-matches/get-group-matches.usecase';
import { GetGroupsByFixtureStageUsecase } from '../groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';
import { Id } from '@deporty-org/entities';

export interface Param {
  tournamentId: Id;
  status: MatchStatusType[];
}
export class GetAllGroupMatchesByTournamentUsecase extends Usecase<
  Param,
  MatchEntity[]
> {
  constructor(
    private getFixtureStagesByTournamentUsecase: GetFixtureStagesByTournamentUsecase,
    private getGroupsByFixtureStageUsecase: GetGroupsByFixtureStageUsecase,
    private getGroupMatchesUsecase: GetGroupMatchesUsecase
  ) {
    super();
  }

  call(param: Param): Observable<MatchEntity[]> {
    return this.getFixtureStagesByTournamentUsecase
      .call(param.tournamentId)
      .pipe(
        mergeMap((fixtureStages: FixtureStageEntity[]) => {
          const $groups: Observable<GroupEntity[]> =
            this.getAllGroupsInTournament(fixtureStages, param.tournamentId);
          return $groups;
        }),
        mergeMap((groups: GroupEntity[]) => {
          const $groupMatches: Observable<MatchEntity[]> = this.getGroupMatches(
            groups,
            param.tournamentId,
            param.status
          );
          return $groupMatches;
        })
      );
  }

  private getAllGroupsInTournament(
    fixtureStages: FixtureStageEntity[],
    tournamentId: string
  ): Observable<GroupEntity[]> {
    return fixtureStages.length > 0
      ? zip(
          ...fixtureStages.map((stage: FixtureStageEntity) => {
            return this.getGroupsByFixtureStageUsecase.call({
              fixtureStageId: stage.id!,
              tournamentId: tournamentId,
            });
          })
        ).pipe(
          map((allGroups: GroupEntity[][]) => {
            return allGroups.reduce((prev, curr) => {
              curr.push(...prev);
              return curr;
            }, []);
          })
        )
      : of([]);
  }

  private getGroupMatches(
    groups: GroupEntity[],
    tournamentId: string,
    status: MatchStatusType[]
  ): Observable<MatchEntity[]> {
    return groups.length > 0
      ? zip(
          ...groups.map((group) => {
            return this.getGroupMatchesUsecase.call({
              fixtureStageId: group.fixtureStageId,
              tournamentId,
              groupId: group.id!,
              states: status,
            });
          })
        ).pipe(
          map((m) => {
            return m.reduce((prev, cur) => {
              cur.push(...prev);
              return cur;
            }, []);
          })
        )
      : of([]);
  }
}
