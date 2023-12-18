import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { RegisteredTeamsContract } from '../../contracts/registered-teams.contract';
import { TeamContract } from '../../contracts/team.contract';

export interface Params {
  tournamentId: Id;
  member: string;
  name: string;
  category: string;
}

export class GetPosibleTeamsToAddUsecase extends Usecase<Params, TeamEntity[]> {
  constructor(private teamContract: TeamContract, private registeredTeamsContract: RegisteredTeamsContract) {
    super();
  }
  call(params: Params): Observable<TeamEntity[]> {
    const $tournament: Observable<TeamEntity[]> = this.registeredTeamsContract
      .filter(
        {
          tournamentId: params.tournamentId,
        },
        {
          tournamentId: {
            operator: '==',
            value: params.tournamentId,
          },
        }
      )
      .pipe(
        mergeMap((registeredTeams: RegisteredTeamEntity[]) => {
          const teams = registeredTeams.map((x) => x.teamId);
          const filters: Filters = {};
          if (teams.length > 0) {
            filters['id'] = {
              operator: 'not-in',
              value: teams.slice(0, 10),
            };
          }
          const category = params.category || 'Open';
          const subCategories = this.getLowerCategories(category);

          const queries = subCategories.map((x) => {
            const innerFilter: Filters = {
              ...filters,
              category: {
                operator: '==',
                value: x,
              },
            };
            return this.teamContract.getTeamByFullFilters(innerFilter);
          });

          return queries.length
            ? zip(...queries).pipe(
                map((queryResults) => {
                  const results = queryResults.reduce((acc, p) => {
                    acc.push(...p);
                    return acc;
                  });
                  return results;
                })
              )
            : this.teamContract.getTeamByFullFilters(filters);
        })
      );
    return $tournament;
  }

  private getLowerCategories(category: string) {
    if (category == 'Open') {
      return [];
    }
    const response = [];
    const regex = /([0-9]+)/g;
    const result = regex.exec(category);
    if (result) {
      const cat = parseInt(result[1]);
      for (let index = 1; index <= cat; index++) {
        response.push('Sub ' + index);
      }
    }
    return response;
  }
}
