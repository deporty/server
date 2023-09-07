import { GroupEntity, Id } from '@deporty-org/entities';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GroupContract } from '../../../contracts/group.contract';
import {
  GroupAlreadyExistsError,
  GroupDoesNotExist,
  LabelMustBeProvidedError,
  OrderMustBeProvidedError,
} from '../../../tournaments.exceptions';
import { GetGroupByLabelUsecase } from '../get-group-by-label/get-group-by-label.usecase';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  group: GroupEntity;
}

export class SaveGroupUsecase extends Usecase<Param, GroupEntity> {
  constructor(
    private getGroupByLabelUsecase: GetGroupByLabelUsecase,
    private groupContract: GroupContract
  ) {
    super();
  }

  call(param: Param): Observable<GroupEntity> {
    const params = {
      tournamentId: param.tournamentId,
      fixtureStageId: param.fixtureStageId,
      groupLabel: param.group.label,
    };
    if (!param.group.label) {
      return throwError(new LabelMustBeProvidedError());
    }

    if (param.group.order === undefined || param.group.order === null) {
      return throwError(new OrderMustBeProvidedError());
    }

    return this.getGroupByLabelUsecase.call(params).pipe(
      mergeMap((group: GroupEntity) => {
        return throwError(new GroupAlreadyExistsError(group.label, 'label'));
      }),
      catchError((error: any) => {
        if (error instanceof GroupDoesNotExist) {
          const group: GroupEntity = { ...param.group, teamIds: [] };
          return this.groupContract
            .save(
              {
                tournamentId: param.tournamentId,
                fixtureStageId: param.fixtureStageId,
              },
              group
            )
            .pipe(
              map((id: Id) => {
                return { ...param.group, id };
              })
            );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
