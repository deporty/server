import { Id, MemberDescriptionType, TeamEntity, TournamentInscriptionEntity } from '@deporty-org/entities';
import { Filters } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
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
  abstract saveTournamentInscriptionsByTeamUsecase(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity>;
}
