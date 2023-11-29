import { Id, MemberEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';
import { EndMemberParticipationUsecase } from '../end-member-participation/end-member-participation.usecase';
import { GetOnlyMemberByIdUsecase } from '../get-only-member-by-id/get-only-member-by-id.usecase';

export interface Param {
  teamOriginId: Id;
  teamDestinationId: Id;
  memberId: Id;
}

export interface Response {
  memberInOriginTeam: MemberEntity;
  memberInDestinationTeam: MemberEntity;
}

export class ChangeMemberToAnotherTeamUsecase extends Usecase<Param, Response> {
  constructor(
    private getOnlyMemberByIdUsecase: GetOnlyMemberByIdUsecase,
    private asignNewMemberToTeamUsecase: AsignNewMemberToTeamUsecase,
    private endMemberParticipationUsecase: EndMemberParticipationUsecase
  ) {
    super();
  }

  call(param: Param): Observable<Response> {
    return this.getOnlyMemberByIdUsecase
      .call({
        memberId: param.memberId,
        teamId: param.teamOriginId,
      })
      .pipe(
        mergeMap((prevMember) => {
          const $asignation = this.asignNewMemberToTeamUsecase.call({
            kindMember: prevMember.kindMember,
            teamId: param.teamDestinationId,
            userId: prevMember.userId,
            number: prevMember.number,
            position: prevMember.position,
          });

          const $endMemberParticipation = this.endMemberParticipationUsecase.call({
            memberId: param.memberId,
            teamId: param.teamOriginId,
          });
          return zip($asignation, $endMemberParticipation);
        }),
        map(([asignation, endmember]) => {
          return {
            memberInDestinationTeam: asignation.member,
            memberInOriginTeam: endmember,
          };
        })
      );
  }
}

//franco canadiense KBvVIwPNtecfB7ZSemZ8
//niupi FWs6ukrRtWav0UeWgG9E
