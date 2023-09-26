import { TeamParticipationEntity, UserEntity } from '@deporty-org/entities';
import { MemberEntity } from '@deporty-org/entities/teams';
import { KindMember } from '@deporty-org/entities/teams/team.entity';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.constract';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';

export interface Param {
  user: UserEntity;
  teamId: string;
  kindMember: KindMember | KindMember[];
}
export interface Response {
  user: UserEntity;
  member: MemberEntity;
  teamParticipation: TeamParticipationEntity;
}

export class CreateUserAndAsignNewMemberToTeamUsecase extends Usecase<Param, Response> {
  constructor(private userContract: UserContract, private asignNewMemberToTeamUsecase: AsignNewMemberToTeamUsecase) {
    super();
  }
  call(param: Param): Observable<Response> {
    const userToCreate: UserEntity = { ...param.user, administrationWay: 'delegated' };
    const $user = this.userContract.createuser(userToCreate);
    return $user.pipe(
      mergeMap((user: UserEntity) => {
        const $asignNewMemberToTeamUsecase = this.asignNewMemberToTeamUsecase.call({
          kindMember: param.kindMember,
          teamId: param.teamId,
          user,
          userId: user.id!,
        });

        return $asignNewMemberToTeamUsecase.pipe(
          map((data) => {
            return {
              user,
              member: data.member,
              teamParticipation: data.teamParticipation,
            };
          })
        );
      })
    );
  }
}
