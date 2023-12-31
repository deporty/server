import { Id } from '@deporty-org/entities';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { forceTransformation, getImageExtension, resizeImageProportionally } from '@scifamek-open-source/tairona';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TeamContract } from '../../contracts/team.contract';
import { TeamNameAlreadyExistsError } from '../create-team/create-team.usecase';
import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
import { GetTeamByUniqueAttributesUsecase } from '../get-team-by-unique-attributes/get-team-by-unique-attributes.usecase';

export interface Param {
  team: TeamEntity;
  id: Id;
  image?: string;
}

export const UserImageNotAllowedError = generateError('UserImageNotAllowed', `Consider usign a square image`);

export class EditTeamUsecase extends Usecase<Param, TeamEntity> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByIdUsecase: GetTeamByIdUsecase,
    private fileAdapter: FileAdapter,

    private getTeamByUniqueAttributesUsecase: GetTeamByUniqueAttributesUsecase
  ) {
    super();
  }
  call(param: Param): Observable<TeamEntity> {
    const team = param.team;

    const miniShieldSize = 30;
    const shieldSize = 300;

    return this.getTeamByIdUsecase.call(param.id).pipe(
      mergeMap((prevTeam: TeamEntity) => {
        if (prevTeam.name !== team.name || prevTeam.city !== team.city || prevTeam.category !== team.category) {
          return this.getTeamByUniqueAttributesUsecase
            .call({
              teamName: team.name,
              category: team.category,
              city: team.city ?? '',
            })
            .pipe(
              mergeMap((data) => {
                if (data === undefined) {
                  return of(prevTeam);
                }
                return throwError(new TeamNameAlreadyExistsError());
              })
            );
        }
        return of(prevTeam);
      }),
      mergeMap((prevTeam: TeamEntity) => {
        if (param.image) {
          const $t = from(
            forceTransformation(param.image, {
              maxAspectRatio: 1.1,
              maxWidth: shieldSize,
            })
          );
          return zip(of(prevTeam), $t);
        }
        return zip(of(prevTeam), of(null));
      }),
      mergeMap(([prevTeam, img]) => {
        if (img === undefined) {
          return throwError(new UserImageNotAllowedError());
        }

        if (img !== null) {
          return this.saveImage(img, miniShieldSize, param.id).pipe(
            mergeMap(([id, path, miniPath]) => {
              return zip(of(prevTeam), of(path), of(miniPath));
            })
          );
        }
        return zip(of(prevTeam), of(param.team.shield), of(param.team.miniShield));
      }),
      mergeMap(([prevTeam, path, pathMini]: [TeamEntity, string?, string?]) => {
        const newUser: TeamEntity = {
          ...prevTeam,
          athem: team.athem,
          category: team.category,
          city: team.city,
          name: team.name,

          shield: path || prevTeam.shield,
          miniShield: pathMini || prevTeam.miniShield,
        };

        return this.teamContract.update(prevTeam.id!, newUser);
      })
    );
  }

  saveImage(shield: string, miniShieldSize: number, id: string): Observable<[string, string, string]> {
    const $resizedImageMini = from(
      resizeImageProportionally(shield, {
        width: miniShieldSize,
      })
    );

    return $resizedImageMini.pipe(
      mergeMap((resizedImageMini) => {
        const extension = getImageExtension(shield);

        const path = `teams/${id}/brand/shield${extension}`;
        const $resizedImageUpload = this.fileAdapter.uploadFile(path, shield).pipe(map((item) => path));
        const pathMini = `teams/${id}/brand/mini-shield${extension}`;
        const $resizedImageMiniUpload = this.fileAdapter.uploadFile(pathMini, resizedImageMini).pipe(map((item) => pathMini));

        return zip($resizedImageUpload, $resizedImageMiniUpload);
      }),
      mergeMap(([path, miniPath]) => {
        return zip(of(id), of(path), of(miniPath));
      })
    );
  }
}
