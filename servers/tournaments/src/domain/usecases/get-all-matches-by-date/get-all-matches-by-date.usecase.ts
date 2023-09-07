import { Id, MatchEntity, TournamentEntity, TournamentStatusType } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { TournamentContract } from '../../contracts/tournament.contract';
import { GetAllGroupMatchesByTournamentUsecase } from '../get-all-group-matches-by-tournament/get-all-group-matches-by-tournament.usecase';
import { map, mergeMap } from 'rxjs/operators';
import {  Filters } from '@scifamek-open-source/iraca/domain';
export interface Response {
  [tournamentId: Id]: {
    tournament: TournamentEntity;
    matches: {
      match: MatchEntity;
      meta: {
        phase: string;
      };
    }[];
  };
}
export class GetAllMatchesByDateUsecase extends Usecase<Date, Response> {
  constructor(
    private tournamentContract: TournamentContract,
    private getAllGroupMatchesByTournamentUsecase: GetAllGroupMatchesByTournamentUsecase
  ) {
    super();
  }

  call(date: Date): Observable<Response> {
    const transformedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const filters: Filters = {
      status: {
        operator: 'in',
        value: ['running'] as TournamentStatusType[],
      },
    };
    return this.tournamentContract.filter(filters).pipe(
      mergeMap((tournaments: TournamentEntity[]) => {
        const response = [];
        for (const tournament of tournaments) {
          const $matches = this.getAllGroupMatchesByTournamentUsecase
            .call({
              tournamentId: tournament.id!,
              status: ['published'],
            })
            .pipe(
              map((matches: MatchEntity[]) => {
                return {
                  matches: matches
                    .filter((m) => {
                      if (!m.date) {
                        return false;
                      }

                      const matchDate = m.date.getFullYear() + '-' + (m.date.getMonth() + 1) + '-' + m.date.getDate();

                      return transformedDate == matchDate;
                    })
                    .map((match: MatchEntity) => {
                      return {
                        match,
                        meta: {
                          phase: 'groups',
                        },
                      };
                    }),

                  tournament,
                };
              })
            );
          response.push($matches);
        }

        if (response.length > 0) {
          return zip(...response);
        }
        return of([]);
      }),
      map((tournaments) => {
        return tournaments.reduce((acc: any, curr) => {
          acc[curr.tournament.id!] = curr;
          return acc;
        }, {});
      })
    );
  }
}
