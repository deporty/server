import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { forceTransformation, resizeImageProportionally } from '@scifamek-open-source/tairona';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Id, TeamParticipationEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { TeamContract } from '../../contracts/team.contract';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';
import { EditTeamUsecase } from '../edit-team/edit-team.usecase';
import { GetTeamByUniqueAttributesUsecase } from '../get-team-by-unique-attributes/get-team-by-unique-attributes.usecase';

export interface Param {
  team: TeamEntity;
  userCreatorId: Id;
}
export interface Response {
  team: TeamEntity;
  member: MemberEntity;
  teamParticipation: TeamParticipationEntity;
}

export const TeamNameAlreadyExistsError = generateError('TeamNameAlreadyExistsError', `The team with the name {name} already exists.`);
export const TeamShieldGeneralError = generateError('TeamShieldGeneralError', `Consider using a square image `);
export const UserCreatorIdNotProvidedError = generateError('UserCreatorIdNotProvidedError', `The user creator Id wat not provided.`);

export class CreateTeamUsecase extends Usecase<Param, Response> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByUniqueAttributesUsecase: GetTeamByUniqueAttributesUsecase,
    private editTeamUsecase: EditTeamUsecase,
    private fileAdapter: FileAdapter,
    private asignNewMemberToTeamUsecase: AsignNewMemberToTeamUsecase
  ) {
    super();
  }

  call(param: Param): Observable<Response> {
    const { team, userCreatorId } = param;
    const miniShieldSize = 30;
    const shieldSize = 300;

    if (!userCreatorId) {
      return throwError(new UserCreatorIdNotProvidedError());
    }
    return this.getTeamByUniqueAttributesUsecase
      .call({
        teamName: team.name,
        category: team.category,
        city: team.city ?? '',
      })
      .pipe(
        mergeMap((teamPrev: TeamEntity | undefined) => {
          if (teamPrev) {
            return throwError(new TeamNameAlreadyExistsError({ name: teamPrev.name }));
          } else {
            const teamToSave = { ...team };
            delete teamToSave['miniShield'];
            delete teamToSave['shield'];

            return this.isAValidImage(team, shieldSize).pipe(
              mergeMap((imageData) => {
                if (!imageData) {
                  return throwError(new TeamShieldGeneralError());
                }
                return this.teamContract.save(teamToSave).pipe(
                  mergeMap((id: string) => {
                    return zip(of(imageData), of(id), of(team));
                  }),
                  mergeMap(([imageData, id, team]) => {
                    return this.saveImage(imageData, miniShieldSize, id);
                  }),
                  mergeMap(([shieldPath, miniShieldPath, id]) => {
                    const teamToEdit: TeamEntity = {
                      ...teamToSave,
                      id,
                      miniShield: miniShieldPath,
                      shield: shieldPath,
                    };

                    return this.editTeamUsecase.call({ team: teamToEdit, id: teamToEdit.id! }).pipe(map(() => teamToEdit));
                  }),

                  mergeMap((team) => {
                    return this.asignNewMemberToTeamUsecase
                      .call({
                        kindMember: ['owner', 'technical-director'],
                        teamId: team.id!,
                        userId: param.userCreatorId,
                        team,
                      })
                      .pipe(
                        map((member) => {
                          return {
                            team,
                            member: member.member,
                            teamParticipation: member.teamParticipation,
                          };
                        })
                      );
                  })
                );
              })
            );
          }
        })
      );
  }

  private isAValidImage(team: TeamEntity, size: number) {
    if (!team.shield) {
      return of('');
    }

    return from(
      forceTransformation(team.shield!, {
        maxAspectRatio: 1.1,
        maxWidth: size,
      })
    );
  }

  saveImage(shield: string, miniShieldSize: number, id: string) {
    const $resizedImageMini = from(
      resizeImageProportionally(shield, {
        width: miniShieldSize,
      })
    );

    return $resizedImageMini.pipe(
      mergeMap((resizedImageMini) => {
        const path = `teams/${id}/brand/shield.png`;
        const $resizedImageUpload = this.fileAdapter.uploadFile(path, shield).pipe(map((item) => path));
        const pathMini = `teams/${id}/brand/mini-shield.png`;
        const $resizedImageMiniUpload = this.fileAdapter.uploadFile(pathMini, resizedImageMini).pipe(map((item) => pathMini));

        return zip($resizedImageUpload, $resizedImageMiniUpload);
      }),
      mergeMap((d) => {
        return zip(of(d[0]), of(d[1]), of(id));
      })
    );
  }
}
