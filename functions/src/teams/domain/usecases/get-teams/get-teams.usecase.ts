import { TeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { Usecase } from '../../../../core/usecase';
import { TeamContract } from '../../contracts/team.contract';

export interface Params {
  pageSize: number;
  pageNumber: number;
}

export class GetTeamsUsecase extends Usecase<Params, TeamEntity[]> {
  constructor(public teamContract: TeamContract) {
    super();
  }
  call(params: Params): Observable<TeamEntity[]> {
    
    return this.teamContract.get({
      pageNumber: parseInt(params.pageNumber+''),
      pageSize: parseInt(params.pageSize+''),
    });
  }
}
