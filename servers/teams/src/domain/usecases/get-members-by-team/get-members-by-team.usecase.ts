import { UserEntity } from '@deporty-org/entities';
import { MemberDescriptionType, MemberEntity } from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { UserContract } from '../../contracts/user.constract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetMembersByTeamUsecase extends Usecase<string, Array<MemberDescriptionType>> {
  constructor(private memberContract: MemberContract, private userContract: UserContract) {
    super();
  }

  call(teamId: string): Observable<Array<MemberDescriptionType>> {
    return this.memberContract
      .filter(
        {
          teamId,
        },
        {
          teamId: {
            operator: '==',
            value: teamId,
          },
        }
      )
      .pipe(
        map((members: Array<MemberEntity>) => {
          return members.filter((c) => {
            return !c.retirementDate;
          });
        }),
        mergeMap((members: Array<MemberEntity>) => {
          const userIds = members.map((member: MemberEntity) => {
            return member.userId;
          });
          return this.userContract.getUsersByIds(userIds).pipe(
            map((users: UserEntity[]) => {
              const response: MemberDescriptionType[] = [];
              for (const user of users) {
                const member = members.find((member) => member.userId === user.id);
                if (member) {
                  response.push({
                    member,
                    user,
                  });
                }
              }
              return response;
            })
          );
        })
      );
  }
}
