import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IBaseResponse, Id, TeamParticipationEntity, UserEntity } from '@deporty-org/entities';
import { UserContract } from '../../domain/contracts/user.constract';
import { BEARER_TOKEN, USERS_SERVER } from '../teams.constants';
export class UserRepository extends UserContract {
  addTeamParticipation(userId: string, teamParticipation: TeamParticipationEntity): Observable<TeamParticipationEntity> {

    return new Observable((observer) => {
      axios
        .post<IBaseResponse<TeamParticipationEntity>>(
          `${USERS_SERVER}/${userId}/team-participation`,

          { teamParticipation, userId },

          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TeamParticipationEntity>;
          if (data.meta.code === 'USER:TEAM-PARTICIPATION-ADDED:SUCCESS') {
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
  getUserInformationById(userId: Id): Observable<UserEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<UserEntity>>(`${USERS_SERVER}/${userId}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<UserEntity>;
          if (data.meta.code === 'USER:GET-BY-ID:SUCCESS') {
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

  getUsersByIds(userIds: string[]): Observable<UserEntity[]> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<UserEntity[]>>(`${USERS_SERVER}/ids`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          params: {
            ids: userIds,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<UserEntity[]>;
          if (data.meta.code === 'USER:GET-BY-IDS:SUCCESS') {
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
