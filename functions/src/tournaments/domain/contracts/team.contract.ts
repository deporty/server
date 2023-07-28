import { Id, MemberDescriptionType, TeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { Filters } from '../../../core/helpers';
export abstract class TeamContract {
  abstract getMembersByTeam(
    teamId: Id
  ): Observable<Array<MemberDescriptionType>>;
  abstract getMemberById(
    teamId: Id,
    memberId: Id
  ): Observable<MemberDescriptionType>;
  abstract getTeamById(teamId: Id): Observable<TeamEntity>;
  abstract getTeamByFilters(filter: any): Observable<TeamEntity[]>;
  abstract getTeamByFullFilters(filter: Filters): Observable<TeamEntity[]>;
}
