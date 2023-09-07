import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable, of, throwError, zip } from 'rxjs';
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
              const $shield = team.shield
                ? (() => {
                    const extension = team.shield.split(',')[0].split('/')[1].split(';')[0];

                    const path = `teams/${id}/brand/shield.${extension}`;
                    return this.fileAdapter.uploadFile(path, team.shield).pipe(map((item) => path));
                  })()
                : of(undefined);

              const $miniShield = team.miniShield
                ? (() => {
                    const extension = team.miniShield.split(',')[0].split('/')[1].split(';')[0];

                    const path = `teams/${id}/brand/mini-shield.${extension}`;

                    return this.fileAdapter.uploadFile(path, team.miniShield).pipe(map((item) => path));
                  })()
                : of(undefined);

              return zip($shield, $miniShield, of(id), of(team));
            }),
            mergeMap((x) => {
              const teamToEdit: TeamEntity = {
                ...x[3],
                id: x[2],
                miniShield: x[1],
                shield: x[0],
              };
              return this.editTeamUsecase.call(teamToEdit).pipe(map((x) => x.id));
            }),
          );
        }
      })
    );
  }
}
