import { TeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { TeamContract } from '../../contracts/team.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { makeFilters } from '@scifamek-open-source/iraca/domain';



export class GetTeamByFiltersUsecase extends Usecase<any, Array<TeamEntity>> {
  constructor(private teamContract: TeamContract) {
    super();
  }
  call(filters: any): Observable<Array<TeamEntity>> {
    return this.teamContract.filter(makeFilters(filters));
  }
}
