import { FixtureStageEntity } from '@deporty-org/entities/tournaments';
import { Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { FixtureStageContract } from '../../../contracts/fixture-stage.contract';

export class FixtureStageAlreadyExistsError extends Error {
  constructor(properties: number[]) {
    super();
    this.name = 'FixtureStageAlreadyExistsError';
    this.message = `The fixture stage already exists: ${properties.join(
      ', '
    )} `;
  }
}

export class CreateFixtureStageUsecase extends Usecase<
  FixtureStageEntity,
  FixtureStageEntity
> {
  constructor(private fixtureStageContract: FixtureStageContract) {
    super();
  }

  call(fixtureStage: FixtureStageEntity): Observable<FixtureStageEntity> {
    
    return this.fixtureStageContract
      .filter(
        {
          tournamentId: fixtureStage.tournamentId,
        },
        {
          order: {
            operator: '==',
            value: fixtureStage.order,
          },
          tournamentId: {
            operator: '==',
            value: fixtureStage.tournamentId,
          },
        }
      )
      .pipe(
        mergeMap((prevFixtureStages: FixtureStageEntity[]) => {
          
          if (prevFixtureStages.length > 0) {
            return throwError(
              new FixtureStageAlreadyExistsError(
                prevFixtureStages.map((x) => x.order)
              )
            );
          }

          return this.fixtureStageContract
            .save(
              {
                tournamentId: fixtureStage.tournamentId,
              },
              fixtureStage
            )
            .pipe(
              map((fixtureStageId: string) => {
                return {
                  ...fixtureStage,
                  id: fixtureStageId,
                };
              })
            );
        })
      );
  }
}
