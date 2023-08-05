import { Id } from '@deporty-org/entities';
import { FixtureStageEntity, GroupEntity } from '@deporty-org/entities/tournaments';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GetFixtureStagesByTournamentUsecase } from '../../fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase';
import { GetGroupsByFixtureStageUsecase } from '../get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';




export interface Result {
  [fixtureStageId: string]: {
    fixtureStage: FixtureStageEntity;
    groups: GroupEntity[];
  };
}

export class GetGroupsByTournamentIdUsecase extends Usecase<Id, Result> {
  constructor(
    private getGroupsByFixtureStageUsecase: GetGroupsByFixtureStageUsecase,
    private getFixtureStagesByTournamentUsecase: GetFixtureStagesByTournamentUsecase
  ) {
    super();
  }

  call(tournamentId: Id): Observable<Result> {
    return this.getFixtureStagesByTournamentUsecase.call(tournamentId).pipe(
      mergeMap((fixtureStages: FixtureStageEntity[]) => {
        if (fixtureStages.length == 0) {
          return of([]);
        }
        return zip(
          ...fixtureStages.map((fixtureStage: FixtureStageEntity) => {
            return this.getGroupsByFixtureStageUsecase
              .call({
                tournamentId,
                fixtureStageId: fixtureStage.id!,
              })
              .pipe(
                map((groups: GroupEntity[]) => {
                  return {
                    fixtureStage,
                    groups,
                  };
                })
              );
          })
        );
      }),
      map((data: { groups: GroupEntity[]; fixtureStage: FixtureStageEntity }[]) => {
        return data.reduce((previousValue: Result, currentValue: { groups: GroupEntity[]; fixtureStage: FixtureStageEntity }) => {
          previousValue[currentValue.fixtureStage.id!] = {
            fixtureStage: currentValue.fixtureStage,
            groups: currentValue.groups,
          };
          return previousValue;
        }, {});
      })
    );
  }
}
