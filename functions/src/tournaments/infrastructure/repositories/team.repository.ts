import {
  IBaseResponse,
  Id,
  MemberDescriptionType,
  TeamEntity,
} from '@deporty-org/entities';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { TeamContract } from '../../domain/contracts/team.contract';
import { BEARER_TOKEN, TEAM_SERVER } from '../tournaments.constants';
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
  getMemberById(teamId: Id, memberId: Id): Observable<MemberDescriptionType> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<MemberDescriptionType>>(
          `${TEAM_SERVER}/${teamId}/member/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<MemberDescriptionType>;
          if (data.meta.code === 'TEAM:GET-MEMBER-BY-ID:SUCCESS') {
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
  getMembersByTeam(teamId: string): Observable<MemberDescriptionType[]> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<MemberDescriptionType[]>>(
          `${TEAM_SERVER}/${teamId}/members`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<MemberDescriptionType[]>;
          if (data.meta.code === 'TEAM:GET-MEMBERS-BY-TEAM-ID:SUCCESS') {
            observer.next(data.data);
          } else {
            observer.next([]);
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
