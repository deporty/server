import { TeamEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamContract } from '../../contracts/team.contract';

export interface Param {
  teamName: string;
  category: string;
  city: string;
}
export class GetTeamByUniqueAttributesUsecase extends Usecase<Param, TeamEntity | undefined> {
  constructor(private teamContract: TeamContract) {
    super();
  }
  call(param: Param): Observable<TeamEntity | undefined> {
    return this.teamContract
      .filter({
        and: {
          name: {
            operator: '==',
            value: param.teamName,
          },
          city: {
            operator: '==',
            value: param.city,
          },
          category: {
            operator: '==',
            value: param.category,
          },
        },
      })
      .pipe(
        map((teams: TeamEntity[]) => {
          console.log('Equipos con la misma información ', JSON.stringify(teams, null, 2));

          if (teams.length === 0) {
            return undefined;
          }
          return teams[0];
        })
      );
  }
}
