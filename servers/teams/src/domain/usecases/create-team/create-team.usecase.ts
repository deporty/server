import { TeamEntity } from '@deporty-org/entities/teams';
import { resizeImage, validateImage } from '@deporty-org/utilities';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { TeamContract } from '../../contracts/team.contract';
import { EditTeamUsecase } from '../edit-team/edit-team.usecase';
import { GetTeamByNameUsecase } from '../get-team-by-name/get-team-by-name.usecase';
import { Id } from '@deporty-org/entities';
import { AsignNewMemberToTeamUsecase } from '../asign-new-member-to-team/asign-new-member-to-team.usecase';

export interface Param {
  team: TeamEntity;
  userCreatorId: Id;
}

export const TeamNameAlreadyExistsError = generateError('TeamNameAlreadyExistsError', `The team with the name {name} already exists.`);
export const UserCreatorIdNotProvidedError = generateError('UserCreatorIdNotProvidedError', `The user creator Id wat not provided.`);

export class CreateTeamUsecase extends Usecase<Param, TeamEntity> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByNameUsecase: GetTeamByNameUsecase,
    private editTeamUsecase: EditTeamUsecase,
    private fileAdapter: FileAdapter,
    private asignNewMemberToTeamUsecase: AsignNewMemberToTeamUsecase
  ) {
    super();
  }

  call(param: Param): Observable<TeamEntity> {
    const { team, userCreatorId } = param;
    const miniShieldSize = 30;
    const shieldSize = 300;

    if (!userCreatorId) {
      return throwError(new UserCreatorIdNotProvidedError());
    }
    return this.getTeamByNameUsecase.call(team.name).pipe(
      mergeMap((teamPrev: TeamEntity | undefined) => {
        if (teamPrev) {
          return throwError(new TeamNameAlreadyExistsError({ name: teamPrev.name }));
        } else {
          const teamToSave = { ...team };
          delete teamToSave['miniShield'];
          delete teamToSave['shield'];
          return this.teamContract.save(teamToSave).pipe(
            mergeMap((id: string) => {
              if (team.shield) {
                const $isValid = from(
                  validateImage(team.shield, {
                    maxAspectRatio: 1.1,
                    mustBeTransparent: true,
                  })
                );

                return $isValid.pipe(
                  mergeMap((valid) => {
                    const $resizedImage = from(resizeImage(team.shield!, shieldSize, shieldSize));
                    const $resizedImageMini = from(resizeImage(team.shield!, miniShieldSize, miniShieldSize));

                    return zip($resizedImage, $resizedImageMini).pipe(
                      mergeMap(([resizedImage, resizedImageMini]) => {
                        const extension = team.shield!.split(',')[0].split('/')[1].split(';')[0];

                        const path = `teams/${id}/brand/shield.${extension}`;
                        const $resizedImageUpload = this.fileAdapter.uploadFile(path, resizedImage).pipe(map((item) => path));

                        const pathMini = `teams/${id}/brand/mini-shield.${extension}`;
                        const $resizedImageMiniUpload = this.fileAdapter
                          .uploadFile(pathMini, resizedImageMini)
                          .pipe(map((item) => pathMini));

                        return zip($resizedImageUpload, $resizedImageMiniUpload);
                      })
                    );
                  }),

                  mergeMap((d) => {
                    return zip(of(d[0]), of(d[1]), of(id), of(team));
                  })
                );
              }

              return zip(of(undefined), of(undefined), of(id), of(team));
            }),
            mergeMap(([shieldPath, miniShieldPath, id, team]) => {
              const teamToEdit: TeamEntity = {
                ...team,
                id,
                miniShield: miniShieldPath,
                shield: shieldPath,
              };
              return this.editTeamUsecase.call(teamToEdit);
            }),

            mergeMap((team: TeamEntity) => {
              return this.asignNewMemberToTeamUsecase
                .call({
                  kindMember: ['owner','technical-director'],
                  teamId: team.id!,
                  userId: param.userCreatorId,
                  team,
                })
                .pipe(map(() => team));
            })
          );
        }
      })
    );
  }
}
