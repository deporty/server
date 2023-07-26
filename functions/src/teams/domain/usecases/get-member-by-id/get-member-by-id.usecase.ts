import { Id, UserEntity } from '@deporty-org/entities';
import {
  MemberDescriptionType,
  MemberEntity,
} from '@deporty-org/entities/teams/teams.model';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { MemberContract } from '../../contracts/member.contract';
import { UserContract } from '../../contracts/user.constract';

export class MemberDoesNotExistException extends Error {
  constructor() {
    super();
    this.message = `The member does not exists.`;
    this.name = 'MemberDoesNotExistException';
  }
}

export interface Param {
  memberId: Id;
  teamId: Id;
}

export class GetMemberByIdUsecase extends Usecase<
  Param,
  MemberDescriptionType
> {
  constructor(
    public memberContract: MemberContract,
    private userContract: UserContract
  ) {
    super();
  }

  call(param: Param): Observable<MemberDescriptionType> {
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
            return throwError(new MemberDoesNotExistException());
          }
          return of(member);
        }),
        mergeMap((member: MemberEntity) => {
          return this.userContract.getUserInformationById(member.userId!).pipe(
            map((user: UserEntity) => ({
              member,
              user,
            }))
          );
        })
      );
  }
}
