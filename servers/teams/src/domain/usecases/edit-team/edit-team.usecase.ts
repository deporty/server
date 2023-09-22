import { Id } from '@deporty-org/entities';
import { TeamEntity } from '@deporty-org/entities/teams';
import { Observable } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { TeamContract } from '../../contracts/team.contract';

export class EditTeamUsecase extends Usecase<TeamEntity, TeamEntity> {
  constructor(public teamContract: TeamContract) {
    super();
  }
  call(team: TeamEntity): Observable<TeamEntity> {
    return this.teamContract.update(team.id as Id, team);
  }
}
