import { GroupEntity, Id } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GroupContract } from '../../../contracts/group.contract';
import { GetGroupByIdUsecase } from '../get-group-by-id/get-group-by-id.usecase';

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  tournamentId: Id;
}

export class DeleteGroupByIdUsecase extends Usecase<Param, void> {
  constructor(
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private groupContract: GroupContract
  ) {
    super();
  }

  call(param: Param): Observable<void> {
    const params = {
      tournamentId: param.tournamentId,
      fixtureStageId: param.fixtureStageId,
      groupId: param.groupId,
    };
    return this.getGroupByIdUsecase.call(params).pipe(
      mergeMap((group: GroupEntity) => {
        return this.groupContract.delete(params, param.groupId);
      })
    );
  }
}
