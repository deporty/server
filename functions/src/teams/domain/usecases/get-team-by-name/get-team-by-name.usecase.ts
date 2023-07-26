import { TeamEntity } from '@deporty-org/entities';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { TeamContract } from '../../contracts/team.contract';


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
        map((teams: TeamEntity[]) => {
          if (teams.length === 0) {
            return throwError(new Error(`The team ${name} does not exist.`));
          }
          return of(teams[0]);
        }),
        mergeMap((x) => x)
      );
  }
}
