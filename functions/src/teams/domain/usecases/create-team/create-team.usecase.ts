import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { EditTeamUsecase } from '../edit-team/edit-team.usecase';
import { GetTeamByNameUsecase } from '../get-team-by-name/get-team-by-name.usecase';
import { TeamAlreadyExistsException } from './create-team.exceptions';
import { FileAdapter } from '../../../../core/file/file.adapter';
import { Usecase } from '../../../../core/usecase';
import { TeamContract } from '../../contracts/team.contract';

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
    return this.getTeamByNameUsecase.call(team.name).pipe(
      map((teamPrev: TeamEntity | undefined) => {
        if (teamPrev) {
          return throwError(new TeamAlreadyExistsException(teamPrev.name));
        } else {
          const teamToSave = { ...team };
          delete teamToSave['miniShield'];
          delete teamToSave['shield'];
          return this.teamContract.save(teamToSave).pipe(
            map((id: string) => {
              const $shield = team.shield
                ? (() => {
                    const extension = team.shield
                      .split(',')[0]
                      .split('/')[1]
                      .split(';')[0];

                    const path = `teams/${id}/brand/shield.${extension}`;
                    return this.fileAdapter
                      .uploadFile(path, team.shield)
                      .pipe(map((item) => path));
                  })()
                : of(undefined);

              const $miniShield = team.miniShield
                ? (() => {
                    const extension = team.miniShield
                      .split(',')[0]
                      .split('/')[1]
                      .split(';')[0];

                    const path = `teams/${id}/brand/mini-shield.${extension}`;

                    return this.fileAdapter
                      .uploadFile(path, team.miniShield)
                      .pipe(map((item) => path));
                  })()
                : of(undefined);

              return zip($shield, $miniShield, of(id), of(team));
            }),
            mergeMap((x) => x),
            map((x) => {
              const teamToEdit: TeamEntity = {
                ...x[3],
                id: x[2],
                miniShield: x[1],
                shield: x[0],
              };
              return this.editTeamUsecase
                .call(teamToEdit)
                .pipe(map((x) => x.id));
            }),
            mergeMap((x) => x)
          );
        }
      }),
      mergeMap((x) => x)
    );
  }
}
