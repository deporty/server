import { Id } from '@deporty-org/entities';
import { MemberEntity } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { GetMemberByIdUsecase } from '../get-member-by-id/get-member-by-id.usecase';
import { UserContract } from '../../contracts/user.constract';

export interface Param {
  memberId: Id;
  teamId: Id;
  member?: MemberEntity;
}

export class DeleteMemberByIdUsecase extends Usecase<Param, boolean> {
  constructor(
    private getMemberByIdUsecase: GetMemberByIdUsecase,
    private memberContract: MemberContract,
    private fileAdapter: FileAdapter,
    private userContract: UserContract
  ) {
    super();
  }

  call(param: Param): Observable<boolean> {
    const { teamId, memberId, member } = param;
    let $member = member
      ? of(member!)
      : this.getMemberByIdUsecase
          .call({
            memberId,
            teamId,
          })
          .pipe(map((member) => member.member));

    return $member.pipe(
      mergeMap((m) => {
        if (m.image) {
          return this.fileAdapter.deleteFile(m.image).pipe(map(() => m));
        }
        return of(m);
      }),
      mergeMap((m) => {
        return this.memberContract
          .delete(
            {
              teamId,
            },
            m.id!
          )
          .pipe(
            mergeMap(() => {
              return this.userContract.deleteTeamParticipation(m.userId, m.teamId);
            })
          );
      })
    );
  }
}
