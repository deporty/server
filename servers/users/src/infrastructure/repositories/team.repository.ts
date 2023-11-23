import { IBaseResponse, TeamEntity } from '@deporty-org/entities';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { TeamContract } from '../../domain/contracts/team.contract';
import { BEARER_TOKEN, TEAM_SERVER } from '../users.constants';

export class TeamRepository extends TeamContract {
  getTeamById(teamId: string): Observable<TeamEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<TeamEntity>>(`${TEAM_SERVER}/${teamId}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TeamEntity>;
          console.log(data)
          if (data.meta.code === 'TEAM:GET-BY-ID:SUCCESS') {
            observer.next(data.data);
          } else {
            observer.error();
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
