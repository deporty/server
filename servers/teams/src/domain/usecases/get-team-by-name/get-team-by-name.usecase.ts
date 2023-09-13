import { TeamEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TeamContract } from '../../contracts/team.contract';

export const TeamWithNameDoesNotExistError = generateError('TeamWithNameDoesNotExistError', `The team with the name {name} does not exist`);

export class GetTeamByNameUsecase extends Usecase<string, TeamEntity> {
  constructor(private teamContract: TeamContract) {
    super();
  }
  call(name: string): Observable<TeamEntity> {
    return this.teamContract
      .filter({
        name: {
          operator: '==',
          value: name,
        },
      })
      .pipe(
        mergeMap((teams: TeamEntity[]) => {
          if (teams.length === 0) {
            return throwError(new TeamWithNameDoesNotExistError({ name }));
          }
          return of(teams[0]);
        })
      );
  }
}
