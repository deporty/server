import { TeamParticipationEntity, UserEntity } from '@deporty-org/entities';
import { MemberEntity } from '@deporty-org/entities/teams';
import { KindMember } from '@deporty-org/entities/teams/team.entity';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.constract';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';

export interface Param {
  user: UserEntity;
  teamId: string;
  kindMember: KindMember | KindMember[];
  number?: number,
  position?: string
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
    const userToCreate: UserEntity = { ...param.user, administrationMode: 'delegated' };

    return this.userContract.getUserByUniqueFieldsUsecase(userToCreate.document, userToCreate.email).pipe(
      map((users) => {

        if (users.length == 1) {
          return users[0];
        } else if (users.length > 1) {
          return users.filter((x) => x.document == userToCreate.document)[0];
        } else {
          return undefined;
        }
      }),
      mergeMap((user) => {
        if (user) {
          return of(user);
        }
        return this.userContract.createuser(userToCreate);
      }),
      mergeMap((user: UserEntity) => {

        const $asignNewMemberToTeamUsecase = this.asignNewMemberToTeamUsecase.call({
          kindMember: param.kindMember,
          number: param.number,
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
