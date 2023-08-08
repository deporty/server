import { FixtureStageConfiguration, TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { Usecase } from '../../../../core/usecase';
import { Observable, of, zip } from 'rxjs';
import { DEFAULT_GROUP_SIZE_LABELS, FixtureStageEntity, Id } from '@deporty-org/entities';
import { CreateFixtureStageUsecase } from '../fixture-stages/create-fixture-stage/create-fixture-stage.usecase';
import { SaveGroupUsecase } from '../groups/save-group/save-group.usecase';
import { map, mergeMap } from 'rxjs/operators';

interface Param {
  tournamentId: Id;
  schema?: TournamentLayoutSchema;
}

export class ImplementSchemaIntoTournamentUsecase extends Usecase<Param, any> {
  constructor(private createFixtureStageUsecase: CreateFixtureStageUsecase, private saveGroupUsecase: SaveGroupUsecase) {
    super();
  }

  call(param: Param): Observable<any> {
    if (!param.schema) {
      return of(null);
    }
    const firstStage: FixtureStageConfiguration = [...param.schema.stages].pop()!;

    return this.createFixtureStageUsecase
      .call({
        tournamentId: param.tournamentId,
        order: 0,
      })
      .pipe(
        mergeMap((fixtureStage: FixtureStageEntity) => {
          const $zip = [];

          for (let i = 0; i < firstStage.groupCount; i++) {
            $zip.push(
              this.saveGroupUsecase.call({
                tournamentId: param.tournamentId,
                fixtureStageId: fixtureStage.id!,
                group: {
                  fixtureStageId: fixtureStage.id!,
                  label: DEFAULT_GROUP_SIZE_LABELS[i],
                  order: i,
                  teamIds: [],
                },
              })
            );
          }

          return zip(...$zip);
        }),
        map(() => {})
      );
  }
}
