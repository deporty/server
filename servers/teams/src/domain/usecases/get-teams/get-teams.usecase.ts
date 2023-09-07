import { TeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { TeamContract } from '../../contracts/team.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export interface Params {
  pageSize: number;
  pageNumber: number;
}

export class GetTeamsUsecase extends Usecase<Params, TeamEntity[]> {
  constructor(public teamContract: TeamContract) {
    super();
  }
  call(params: Params): Observable<TeamEntity[]> {
    return this.teamContract.get(params);
  }
}
