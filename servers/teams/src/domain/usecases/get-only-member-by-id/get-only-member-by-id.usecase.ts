import { Id } from '@deporty-org/entities';
import { MemberEntity } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { MemberDoesNotExistError } from '../get-member-by-id/get-member-by-id.usecase';


export interface Param {
  memberId: Id;
  teamId: Id;
}

export class GetOnlyMemberByIdUsecase extends Usecase<Param, MemberEntity> {
  constructor(public memberContract: MemberContract) {
    super();
  }

  call(param: Param): Observable<MemberEntity> {
    const { teamId, memberId } = param;
    return this.memberContract
      .getById(
        {
          teamId,
        },
        memberId
      )
      .pipe(
        mergeMap((member: MemberEntity | undefined) => {
          if (!member) {
            return throwError(new MemberDoesNotExistError());
          }
          return of(member);
        })
      );
  }
}
