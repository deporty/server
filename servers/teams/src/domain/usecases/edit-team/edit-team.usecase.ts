import { Id } from '@deporty-org/entities';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { TeamContract } from '../../contracts/team.contract';
import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forceTransformation, getImageExtension, resizeImageProportionally } from '@scifamek-open-source/tairona';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { GetTeamByNameUsecase, TeamWithNameDoesNotExistError } from '../get-team-by-name/get-team-by-name.usecase';
import { TeamNameAlreadyExistsError } from '../create-team/create-team.usecase';

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

    private getTeamByNameUsecase: GetTeamByNameUsecase
  ) {
    super();
  }
  call(param: Param): Observable<TeamEntity> {
    const team = param.team;

    const miniShieldSize = 30;
    const shieldSize = 300;

    return this.getTeamByIdUsecase.call(param.id).pipe(
      mergeMap((prevTeam: TeamEntity) => {
        if (prevTeam.name !== team.name) {
          return this.getTeamByNameUsecase.call(team.name).pipe(
            catchError((e: Error) => {
              if (e instanceof TeamWithNameDoesNotExistError) {
                return of(null);
              }
              return throwError(e);
            }),
            mergeMap((data) => {
              if(data === null){
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

          shield: path ? this.fileAdapter.getRelativeUrl(path) : prevTeam.shield,
          miniShield: pathMini ? this.fileAdapter.getRelativeUrl(pathMini) : prevTeam.miniShield,
        };

        return this.teamContract.update(prevTeam.id!, newUser).pipe(
          mergeMap((user) => {
            return zip(
              of(user),
              user.shield ? this.fileAdapter.getAbsoluteHTTPUrl(user.shield!) : of(''),
              user.miniShield ? this.fileAdapter.getAbsoluteHTTPUrl(user.miniShield!) : of('')
            );
          }),
          map(([user, path, miniPath]) => {
            return {
              ...user,
              shield: path,
              miniShield: miniPath,
            };
          })
        );
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
