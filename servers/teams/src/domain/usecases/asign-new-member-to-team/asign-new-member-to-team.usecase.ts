import { UserEntity } from '@deporty-org/entities';
import { MemberDescriptionType, MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { KindMember } from '@deporty-org/entities/teams/team.entity';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { TeamContract } from '../../contracts/team.contract';
import { UserContract } from '../../contracts/user.constract';
import { GetMembersByTeamUsecase } from '../get-members-by-team/get-members-by-team.usecase';
import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';

export interface Param {
  teamId: string;
  userId: string;
  kindMember: KindMember | KindMember[];
  team?: TeamEntity
}

export const MemberIsAlreadyInTeamError = generateError(
  'MemberIsAlreadyInTeamError',
  'The member with the document {property} already exists in the team'
);

export class AsignNewMemberToTeamUsecase extends Usecase<Param, MemberEntity> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByIdUsecase: GetTeamByIdUsecase,
    private getMembersByTeamUsecase: GetMembersByTeamUsecase,
    private userContract: UserContract,
    private memberContract: MemberContract
  ) {
    super();
  }
  call(param: Param): Observable<MemberEntity> {
    const $getPlayerByIdUsecase = this.userContract.getUserInformationById(param.userId);

    const $getTeamByIdUsecase = param.team ? of(param.team) : this.getTeamByIdUsecase.call(param.teamId);

    return zip($getPlayerByIdUsecase, $getTeamByIdUsecase).pipe(
      mergeMap(([user, team]: [UserEntity, TeamEntity]) => {
        const $members = this.getMembersByTeamUsecase.call(team.id!);
        return $members.pipe(
          mergeMap((members: MemberDescriptionType[]) => {
            const existsPlayer =
              members.filter((p: MemberDescriptionType) => {
                return p.user.id === user.id && !p.member.retirementDate;
              }).length > 0;

            if (!existsPlayer) {
              const newMember: MemberEntity = {
                initDate: new Date(),
                kindMember: param.kindMember,
                teamId: team.id!,
                userId: user.id!,
                enrollmentDate: new Date(),
              };

              const $teamUpdated = this.memberContract
                .save(
                  {
                    teamId: team.id!,
                  },
                  newMember
                )
                .pipe(
                  map((id: string) => {
                    return {
                      ...newMember,
                      id,
                    };
                  })
                );
              return $teamUpdated;
            } else {
              return throwError(new MemberIsAlreadyInTeamError());
            }
          })
        );
      })
    );
  }
}
