import { Id } from '@deporty-org/entities';
import { MemberEntity } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { GetOnlyMemberByIdUsecase } from '../get-only-member-by-id/get-only-member-by-id.usecase';
import { UserContract } from '../../contracts/user.constract';

export interface Param {
  memberId: Id;
  teamId: Id;
}

export class EndMemberParticipationUsecase extends Usecase<Param, MemberEntity> {
  constructor(
    private getOnlyMemberByIdUsecase: GetOnlyMemberByIdUsecase,
    private memberContract: MemberContract,
    private fileAdapter: FileAdapter,
    private userContract: UserContract
  ) {
    super();
  }

  call(param: Param): Observable<MemberEntity> {
    const { teamId, memberId } = param;
    return this.getOnlyMemberByIdUsecase
      .call({
        teamId,
        memberId,
      })
      .pipe(
        mergeMap((prevMember) => {

          const newMember: MemberEntity = {
            ...prevMember,
            image: prevMember.image ? this.fileAdapter.getRelativeUrl(prevMember.image) : prevMember.image,
            retirementDate: new Date(),
          };

          return this.memberContract
            .update(
              {
                teamId,
              },
              newMember
            )
            .pipe(
              mergeMap(() => {

                return this.userContract.getTeamParticipationByProperties(newMember.userId, newMember.teamId, newMember.initDate!).pipe(
                  mergeMap((teamParticipation) => {
                    if (teamParticipation) {

                      return this.userContract.editTeamParticipation(newMember.userId, {
                        ...teamParticipation,
                        retirementDate: newMember.retirementDate,
                      });
                    }
                    return of(undefined);
                  })
                );
              }),

              mergeMap(() => {
                return zip(of(newMember), newMember.image ? this.fileAdapter.getAbsoluteHTTPUrl(newMember.image) : of(''));
              }),
              map(([user, p]) => {
                console.log('Lo que se envia al celular');
                console.log({ ...user, image: p });

                return {
                  ...user,
                  image: p,
                };
              })
            );
        })
      );
  }
}
