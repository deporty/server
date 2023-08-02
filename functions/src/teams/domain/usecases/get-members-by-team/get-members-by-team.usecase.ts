import { UserEntity } from '@deporty-org/entities';
import { MemberDescriptionType, MemberEntity } from '@deporty-org/entities/teams';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { MemberContract } from '../../contracts/member.contract';
import { UserContract } from '../../contracts/user.constract';

export class GetMembersByTeamUsecase extends Usecase<string, Array<MemberDescriptionType>> {
  constructor(public memberContract: MemberContract, private userContract: UserContract) {
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
        mergeMap((members: Array<MemberEntity>) => {
          console.log('Member length: ', members.length);

          const $members = members.map((member: MemberEntity) => {
            return this.userContract.getUserInformationById(member.userId!).pipe(
              map((user: UserEntity | undefined) => ({
                member,
                user,
              }))
            );
          });
          return $members.length > 0 ? zip(...$members) : of([]);
        }),
        map(
          (
            data: Array<{
              member: MemberEntity;
              user: UserEntity | undefined;
            }>
          ) => {
            const filtered = data.filter((x) => !!x.user);
            return filtered as Array<MemberDescriptionType>;
          }
        )
      );
  }
}
