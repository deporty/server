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

export const TeamNameAlreadyExistsError = generateError('TeamNameAlreadyExistsError', `The team with the name {name} already exists.`);

export class CreateTeamUsecase extends Usecase<TeamEntity, string | undefined> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByNameUsecase: GetTeamByNameUsecase,
    private editTeamUsecase: EditTeamUsecase,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(team: TeamEntity): Observable<string | undefined> {
    const miniShieldSize = 30;
    const shieldSize = 300;
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
            mergeMap(([shieldPath, miniShieldPath,id, team]) => {
              const teamToEdit: TeamEntity = {
                ...team,
                id,
                miniShield: miniShieldPath,
                shield: shieldPath,
              };
              return this.editTeamUsecase.call(teamToEdit).pipe(map((x) => x.id));
            })
          );
        }
      })
    );
  }
}
