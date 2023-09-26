import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { resizeImage, validateImage, removeWhiteBackground } from '@deporty-org/utilities';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { TeamContract } from '../../contracts/team.contract';
import { EditTeamUsecase } from '../edit-team/edit-team.usecase';
import { GetTeamByNameUsecase, TeamWithNameDoesNotExistError } from '../get-team-by-name/get-team-by-name.usecase';
import { Id, TeamParticipationEntity } from '@deporty-org/entities';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';

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
export const UserCreatorIdNotProvidedError = generateError('UserCreatorIdNotProvidedError', `The user creator Id wat not provided.`);

export class CreateTeamUsecase extends Usecase<Param, Response> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByNameUsecase: GetTeamByNameUsecase,
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
    return this.getTeamByNameUsecase.call(team.name).pipe(
      catchError((e: Error) => {
        if (e instanceof TeamWithNameDoesNotExistError) {
          return of(undefined);
        }
        return throwError(e);
      }),
      mergeMap((teamPrev: TeamEntity | undefined) => {
        if (teamPrev) {
          return throwError(new TeamNameAlreadyExistsError({ name: teamPrev.name }));
        } else {
          const teamToSave = { ...team };
          delete teamToSave['miniShield'];
          delete teamToSave['shield'];

          return this.isAValidImage(team).pipe(
            mergeMap((imageData) => {
              return this.teamContract.save(teamToSave).pipe(
                mergeMap((id: string) => {
                  return zip(of(imageData), of(id), of(team));
                }),
                mergeMap(([imageData, id, team]) => {
                  return this.saveImage(imageData, shieldSize, miniShieldSize, id);
                }),
                mergeMap(([shieldPath, miniShieldPath, id]) => {
                  const teamToEdit: TeamEntity = {
                    ...teamToSave,
                    id,
                    miniShield: miniShieldPath,
                    shield: shieldPath,
                  };
                  return this.editTeamUsecase.call(teamToEdit);
                }),
                mergeMap((team: TeamEntity) => {
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
                          team: team,
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

  private isAValidImage(team: TeamEntity) {
    if (!team.shield) {
      return of('');
    }
    return from(
      validateImage(team.shield!, {
        maxAspectRatio: 1.1,
      })
    ).pipe(
      mergeMap((valid) => {
        const $isTransparent = from(
          validateImage(team.shield!, {
            mustBeTransparent: true,
          })
        );

        return $isTransparent;
      }),

      catchError((err) => {
        return from(removeWhiteBackground(team.shield!));
      }),
      mergeMap((valid) => {
        if (typeof valid === 'boolean') {
          return of(team.shield!);
        } else {
          return of(valid);
        }
      })
    );
  }

  saveImage(shield: string, shieldSize: number, miniShieldSize: number, id: string) {
    const $resizedImage = from(resizeImage(shield, shieldSize, shieldSize));
    const $resizedImageMini = from(resizeImage(shield, miniShieldSize, miniShieldSize));

    return zip($resizedImage, $resizedImageMini).pipe(
      mergeMap(([resizedImage, resizedImageMini]) => {
        const path = `teams/${id}/brand/shield.png`;
        const $resizedImageUpload = this.fileAdapter.uploadFile(path, resizedImage).pipe(map((item) => path));
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
