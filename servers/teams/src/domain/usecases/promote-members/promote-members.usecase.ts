import { Id, KindMember, MemberEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';
import { EditMemberByIdUsecase } from '../edit-member-by-id/edit-member-by-id.usecase';
import { GetOnlyMembersByTeamUsecase } from '../get-only-members-by-team/get-only-members-by-team.usecase';

export interface Param {
  teamOrigin: Id;
  teamDestination: Id;
  removeFromOrigin: boolean;
  kindMembers: KindMember[] | KindMember;
}

export interface Response {
  membersTeamOrigin: MemberEntity[];
  membersTeamDestination: MemberEntity[];
}

export class PromoteMembersUsecase extends Usecase<Param, Response> {
  constructor(
    private getOnlyMembersByTeamUsecase: GetOnlyMembersByTeamUsecase,
    private asignNewMemberToTeamUsecase: AsignNewMemberToTeamUsecase,
    private editMemberByIdUsecase: EditMemberByIdUsecase
  ) {
    super();
  }

  isAValidKindMember(memberKinds: KindMember[] | KindMember, searchedKindMembers: KindMember[] | KindMember) {
    const tempMemberKinds = Array.isArray(memberKinds) ? memberKinds : [memberKinds];
    const tempsearchedKindMembers = Array.isArray(searchedKindMembers) ? searchedKindMembers : [searchedKindMembers];
    for (const myKindsMember of tempsearchedKindMembers) {
      if (tempMemberKinds.includes(myKindsMember)) {
        return true;
      }
    }
    return false;
  }
  call(param: Param): Observable<Response> {

    const kindMembers = param.kindMembers || [];

    return this.getOnlyMembersByTeamUsecase
      .call({
        includeRetired: false,
        teamId: param.teamOrigin,
      })
      .pipe(
        map((members: MemberEntity[]) => {
          console.log('Members originales ', members, members.length);

          return members.filter((x) => {
            return this.isAValidKindMember(x.kindMember, kindMembers);
          });
        }),
        mergeMap((members: MemberEntity[]) => {
          console.log('Members to migrate ', members, members.length);
          // return zip(of([]), of([]));

          const $newAssignMembers = [];
          const $editMembers = [];

          for (const member of members) {
            $newAssignMembers.push(
              this.asignNewMemberToTeamUsecase.call({
                kindMember: member.kindMember,
                teamId: param.teamDestination,
                userId: member.userId,
                number: member.number,
                position: member.position,
              })
            );
            if (param.removeFromOrigin) {
              $editMembers.push(
                this.editMemberByIdUsecase.call({
                  member: { ...member, retirementDate: new Date() },
                  memberId: member.id!,
                  teamId: param.teamOrigin,
                })
              );
            }
          }

          return zip(
            $newAssignMembers.length > 0 ? zip(...$newAssignMembers) : of([]),
            $editMembers.length > 0 ? zip(...$editMembers) : of([])
          );
        }),
        map(([newMembers, oldMembers]) => {
          return {
            membersTeamDestination: newMembers.map((x) => x.member),
            membersTeamOrigin: oldMembers,
          };
        })
        // map(([newMembers, oldMembers]) => {
        //   return {
        //     membersTeamDestination: newMembers as [],
        //     membersTeamOrigin: oldMembers as [],
        //   };
        // })
      );
  }
}

//franco canadiense KBvVIwPNtecfB7ZSemZ8
//niupi FWs6ukrRtWav0UeWgG9E
