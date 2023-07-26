import { TeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { makeFilters } from '../../../../core/helpers';
import { Usecase } from '../../../../core/usecase';
import { TeamContract } from '../../contracts/team.contract';



export class GetTeamByFiltersUsecase extends Usecase<any, Array<TeamEntity>> {
  constructor(private teamContract: TeamContract) {
    super();
  }
  call(filters: any): Observable<Array<TeamEntity>> {
    return this.teamContract.filter(makeFilters(filters));
  }
}
