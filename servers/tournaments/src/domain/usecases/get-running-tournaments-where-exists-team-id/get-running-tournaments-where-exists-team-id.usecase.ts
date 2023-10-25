import { Id, RegisteredTeamEntity, TournamentEntity, TournamentStatusType } from '@deporty-org/entities';
import {  Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RegisteredTeamsContract } from '../../contracts/registered-teams.contract';
import { TournamentContract } from '../../contracts/tournament.contract';

export interface Param {
  teamId: Id;
  status?: TournamentStatusType[];
}

export interface Response {
  tournament: TournamentEntity;
  registeredTeam: RegisteredTeamEntity;
}

export class GetRunningTournamentsWhereExistsTeamIdUsecase extends Usecase<Param, Response[]> {
  constructor(private tournamentContract: TournamentContract, private registeredTeamsContract: RegisteredTeamsContract) {
    super();
  }

  call(param: Param): Observable<Response[]> {
    const statusToSearch = param.status || ['check-in', 'running'];
    const filters: Filters = {};
    filters['status'] = {
      operator: 'in',
      value: statusToSearch,
    };
    console.log(filters);

    return this.tournamentContract.filter(filters).pipe(
      mergeMap((tournaments) => {
        const $tournaments = tournaments.map((tournament) =>
          this.registeredTeamsContract
            .filter(
              {
                tournamentId: tournament.id!,
              },
              {
                teamId: {
                  operator: '==',
                  value: param.teamId,
                },
              }
            )
            .pipe(
              map((registeredTeams) => {
                return {
                  tournament,
                  registeredTeams,
                };
              })
            )
        );

        return $tournaments.length ? zip(...$tournaments) : of([]);
      }),

      map((data) => {
        return data
          .filter((tournament) => tournament.registeredTeams.length)
          .map((t): Response => {
            return {
              tournament: t.tournament,
              registeredTeam: t.registeredTeams[0],
            };
          });
      })
    );
  }
}
