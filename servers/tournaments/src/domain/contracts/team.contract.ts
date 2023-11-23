import { Id, MemberDescriptionType, MemberEntity, TeamEntity, TournamentInscriptionEntity } from '@deporty-org/entities';
import { Filters } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
export abstract class TeamContract {
  abstract getMembersByTeam(teamId: Id): Observable<Array<MemberDescriptionType>>;
  abstract getOnlyMembersByTeam(teamId: Id, includeRetired: boolean): Observable<Array<MemberEntity>>;
  abstract getMemberById(teamId: Id, memberId: Id): Observable<MemberDescriptionType>;
  abstract getOnlyMemberById(teamId: Id, memberId: Id): Observable<MemberEntity>;
  abstract getTeamById(teamId: Id): Observable<TeamEntity>;
  abstract getTeamByFilters(filter: any): Observable<TeamEntity[]>;
  abstract getTeamByFullFilters(filter: Filters): Observable<TeamEntity[]>;
  abstract saveTournamentInscriptionsByTeamUsecase(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity>;
  abstract updateTournamentInscriptionsByTeamUsecase(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity>;
}
