import { GroupEntity, Id } from '@deporty-org/entities';
import { Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GroupContract } from '../../../contracts/group.contract';
import {
  LabelMustBeProvidedError,
  OrderMustBeProvidedError,
} from '../../../tournaments.exceptions';
import { GetGroupByIdUsecase } from '../get-group-by-id/get-group-by-id.usecase';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  group: GroupEntity;
}

export class UpdateGroupUsecase extends Usecase<Param, GroupEntity> {
  constructor(
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private groupContract: GroupContract
  ) {
    super();
  }

  call(param: Param): Observable<GroupEntity> {
    const params = {
      tournamentId: param.tournamentId,
      fixtureStageId: param.fixtureStageId,
      groupId: param.group.id as string,
    };
    if (!param.group.label) {
      return throwError(new LabelMustBeProvidedError());
    }

    if (param.group.order == undefined || param.group.order == null) {
      return throwError(new OrderMustBeProvidedError());
    }

    return this.getGroupByIdUsecase.call(params).pipe(
      mergeMap((group: GroupEntity) => {
        const newGroup = { ...group };
        newGroup.label = param.group.label;
        newGroup.order = param.group.order;
        newGroup.teamIds = param.group.teamIds;
        newGroup.positionsTable = param.group.positionsTable;

        return this.groupContract
          .update(
            {
              tournamentId: param.tournamentId,
              fixtureStageId: param.fixtureStageId,
              groupId: param.group.id,
            },
            newGroup
          )
          .pipe(
            map(() => {
              return newGroup;
            })
          );
      })
    );
  }
}
