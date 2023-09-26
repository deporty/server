import { Id } from '@deporty-org/entities';
import { MemberDescriptionType } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DeleteMemberByIdUsecase } from '../delete-member-by-id/delete-member-by-id.usecase';
import { GetMembersByTeamUsecase } from '../get-members-by-team/get-members-by-team.usecase';

export class DeleteMembersFromTeamUsecase extends Usecase<Id, boolean> {
  constructor(private getMembersByTeamUsecase: GetMembersByTeamUsecase, private deleteMemberByIdUsecase: DeleteMemberByIdUsecase) {
    super();
  }

  call(teamId: string): Observable<boolean> {
    return this.getMembersByTeamUsecase.call(teamId).pipe(
      mergeMap((members: MemberDescriptionType[]) => {
        if (members.length == 0) {
          return of([]);
        }
        const $response: Observable<boolean>[] = [];
        for (const member of members) {
          $response.push(
            this.deleteMemberByIdUsecase.call({
              member: member.member,
              memberId: member.member.id!,
              teamId,
            })
          );
        }
        return zip(...$response);
      }),
      map(() => true)
    );
  }
}
