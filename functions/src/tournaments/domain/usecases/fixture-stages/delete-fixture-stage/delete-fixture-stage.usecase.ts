import { GroupEntity, Id, Id as params } from '@deporty-org/entities';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { FixtureStageContract } from '../../../contracts/fixture-stage.contract';
import { GetGroupsByFixtureStageUsecase } from '../../groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';
import { DeleteGroupByIdUsecase } from '../../groups/delete-group-by-id/delete-group-by-id.usecase';

export interface Params {
  tournamentId: params;
  fixtureStageId: params;
}

export class DeleteFixtureStageUsecase extends Usecase<Params, Id> {
  constructor(
    private fixtureStageContract: FixtureStageContract,
    private getGroupsByFixtureStageUsecase: GetGroupsByFixtureStageUsecase,
    private deleteGroupByIdUsecase: DeleteGroupByIdUsecase
  ) {
    super();
  }

  call(params: Params): Observable<Id> {
    return this.getGroupsByFixtureStageUsecase
      .call({
        fixtureStageId: params.fixtureStageId,
        tournamentId: params.tournamentId,
      })
      .pipe(
        mergeMap((groups: GroupEntity[]) => {
          return groups.length == 0
            ? of(void 0)
            : zip(
                ...groups.map((group: GroupEntity) =>
                  this.deleteGroupByIdUsecase.call({
                    fixtureStageId: params.fixtureStageId,
                    tournamentId: params.tournamentId,
                    groupId: group.id!,
                  })
                )
              );
        }),
        mergeMap(() => {
          return this.fixtureStageContract
            .delete(
              {
                tournamentId: params.tournamentId,
              },
              params.fixtureStageId
            )
            .pipe(
              map((data: void) => {
                return params.fixtureStageId;
              })
            );
        })
      );
  }
}
