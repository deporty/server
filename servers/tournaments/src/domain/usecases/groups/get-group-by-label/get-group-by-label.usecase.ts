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
  groupLabel: string;
}

export class GetGroupByLabelUsecase extends Usecase<
  Param,
  GroupEntity
> {
  constructor(private groupContract: GroupContract) {
    super();
  }

  call(param: Param): Observable<GroupEntity> {
    return this.groupContract
      .filter(
        {
          tournamentId: param.tournamentId,
          fixtureStageId: param.fixtureStageId,
        },
        {
          label: {
            operator: '==',
            value: param.groupLabel
          }
        }
      )
      .pipe(
        mergeMap((group) => {
          if (!!group && group.length > 0) {
            return of(group[0]);
          }
          return throwError(new GroupDoesNotExist(param.groupLabel, 'label'));
        })
      );
  }
}
