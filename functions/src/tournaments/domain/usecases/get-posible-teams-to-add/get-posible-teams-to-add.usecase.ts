import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { RegisteredTeamsContract } from '../../contracts/registered-teams.contract';
import { Filters } from '../../../../core/helpers';
import { TeamContract } from '../../contracts/team.contract';

export interface Params {
  tournamentId: Id;
  member: string;
  name: string;
  category: string;
}

export class GetPosibleTeamsToAddUsecase extends Usecase<Params, TeamEntity[]> {
  constructor(
    private teamContract: TeamContract,
    private registeredTeamsContract: RegisteredTeamsContract
  ) {
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
              value: teams,
            };
          } 
          if(params.category){
            filters['category'] = {
              operator: '==',
              value: params.category,
            };
          }
          if(params.name){
            filters['name'] = {
              operator: 'contains',
              value: params.name,
            };
          }
          return this.teamContract.getTeamByFullFilters(filters);
        })
      );
    return $tournament;
  }
}
