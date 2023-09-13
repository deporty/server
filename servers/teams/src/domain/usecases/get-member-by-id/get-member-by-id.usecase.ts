import { Id, UserEntity } from '@deporty-org/entities';
import { MemberDescriptionType, MemberEntity } from '@deporty-org/entities/teams';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { UserContract } from '../../contracts/user.constract';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const MemberDoesNotExistError = generateError('MemberDoesNotExistError', `The member does not exists.`);

export interface Param {
  memberId: Id;
  teamId: Id;
}

export class GetMemberByIdUsecase extends Usecase<Param, MemberDescriptionType> {
  constructor(public memberContract: MemberContract, private userContract: UserContract) {
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
            return throwError(new MemberDoesNotExistError());
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
