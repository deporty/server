import { Id } from '@deporty-org/entities';
import { GroupEntity } from '@deporty-org/entities/tournaments';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GroupContract } from '../../../contracts/group.contract';
import { GroupDoesNotExist } from '../../../tournaments.exceptions';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
}

export class GetGroupByIdUsecase extends Usecase<
  Param,
  GroupEntity
> {
  constructor(private groupContract: GroupContract) {
    super();
  }

  call(param: Param): Observable<GroupEntity> {
    return this.groupContract
      .getById(
        {
          tournamentId: param.tournamentId,
          fixtureStageId: param.fixtureStageId,
          groupId: param.groupId,
        },
        param.groupId
      )
      .pipe(
        mergeMap((group) => {
          if (!!group) {
            return of(group);
          }
          return throwError(new GroupDoesNotExist(param.groupId));
        })
      );
  }
}
