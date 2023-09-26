import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IBaseResponse, Id, TeamParticipationEntity, UserEntity } from '@deporty-org/entities';
import { UserContract } from '../../domain/contracts/user.constract';
import { BEARER_TOKEN, USERS_SERVER } from '../teams.constants';
export class UserRepository extends UserContract {
  deleteTeamParticipation(userId: string, teamId: string): Observable<boolean> {
    return new Observable((observer) => {
      axios
        .delete<IBaseResponse<boolean>>(
          `${USERS_SERVER}/${userId}/team-participation/${teamId}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<boolean>;
          console.log(0, data, 0);
          if (data.meta.code === 'USER:TEAM-PARTICIPATION-DELETED:SUCCESS') {
            observer.next(data.data);
          } else {
            const e = new Error(data.meta.message);
            e.name = data.meta.code;
            observer.error(e);
          }
          observer.complete();
        })
        .catch((error: any) => {
          console.log(1, error, 1);
          observer.error(error);
        });
    });
  }
  createuser(user: UserEntity): Observable<UserEntity> {
    return new Observable((observer) => {
      axios
        .post<IBaseResponse<UserEntity>>(
          `${USERS_SERVER}`,
          { ...user },
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<UserEntity>;
          console.log(0, data, 0);
          if (data.meta.code === 'USER:POST:SUCCESS') {
            observer.next(data.data);
          } else {
            const e = new Error(data.meta.message);
            e.name = data.meta.code;
            observer.error(e);
          }
          observer.complete();
        })
        .catch((error: any) => {
          console.log(1, error, 1);
          observer.error(error);
        });
    });
  }
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
