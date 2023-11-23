import { IBaseResponse, Id, MemberDescriptionType, MemberEntity, TeamEntity, TournamentInscriptionEntity } from '@deporty-org/entities';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { TeamContract } from '../../domain/contracts/team.contract';
import { BEARER_TOKEN, TEAM_SERVER } from '../tournaments.constants';
import { Filters } from '@scifamek-open-source/iraca/domain';

export class TeamRepository extends TeamContract {
  getMemberById(teamId: Id, memberId: Id): Observable<MemberDescriptionType> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<MemberDescriptionType>>(`${TEAM_SERVER}/${teamId}/member/${memberId}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
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
        .get<IBaseResponse<MemberDescriptionType[]>>(`${TEAM_SERVER}/${teamId}/members`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<MemberDescriptionType[]>;
          if (data.meta.code === 'TEAM:GET-MEMBERS-BY-TEAM-ID:SUCCESS') {
            observer.next(
              data.data.map((x: MemberDescriptionType) => {
                return {
                  ...x,
                  member: {
                    ...x.member,
                    initDate: x.member.initDate ? new Date(x.member.initDate as unknown as string) : undefined,
                    retirementDate: x.member.retirementDate ? new Date(x.member.retirementDate as unknown as string) : undefined,
                  },
                } as MemberDescriptionType;
              })
            );
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

  getOnlyMemberById(teamId: string, memberId: string): Observable<MemberEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<TournamentInscriptionEntity>>(`${TEAM_SERVER}/${teamId}/member/${memberId}/only-member`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<MemberEntity>;
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

  getOnlyMembersByTeam(teamId: string, includeRetired: boolean): Observable<MemberEntity[]> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<TournamentInscriptionEntity>>(`${TEAM_SERVER}/${teamId}/only-members`, {
          params: {
            includeRetired
          },
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<MemberEntity[]>;
          if (data.meta.code === 'TEAM:GET-MEMBERS-BY-TEAM-ID:SUCCESS') {
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

  getTeamByFilters(filter: any): Observable<TeamEntity[]> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<TeamEntity[]>>(`${TEAM_SERVER}/filter`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          params: filter,
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TeamEntity[]>;
          if (data.meta.code === 'TEAM:GET:SUCCESS') {
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

  getTeamByFullFilters(filter: Filters): Observable<TeamEntity[]> {
    return new Observable((observer) => {
      axios
        .post<IBaseResponse<TeamEntity[]>>(`${TEAM_SERVER}/advanced-filter`, filter, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TeamEntity[]>;
          if (data.meta.code === 'TEAM:GET:SUCCESS') {
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

  saveTournamentInscriptionsByTeamUsecase(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity> {
    console.log("enviando ", JSON.stringify(inscription, null, 2));
    
    return new Observable((observer) => {
      axios
        .post<IBaseResponse<TournamentInscriptionEntity>>(`${TEAM_SERVER}/${inscription.teamId}/tournament-inscription`, inscription, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TournamentInscriptionEntity>;
          if (data.meta.code === 'TEAM:TOURNAMENT-INSCRIPTIONS-ADDED:SUCCESS') {
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

  updateTournamentInscriptionsByTeamUsecase(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity> {
   
    return new Observable((observer) => {
      axios
        .patch<IBaseResponse<TournamentInscriptionEntity>>(`${TEAM_SERVER}/${inscription.teamId}/tournament-inscription`, inscription, {
          
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TournamentInscriptionEntity>;
          if (data.meta.code === 'TEAM:TOURNAMENT-INSCRIPTIONS-UPDATED:SUCCESS') {
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
