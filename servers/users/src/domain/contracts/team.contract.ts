import { Id, TeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';

export abstract class TeamContract {
  abstract getTeamById(teamId: Id): Observable<TeamEntity>;
}
