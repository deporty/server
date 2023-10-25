import { Id, TeamParticipationEntity, UserEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
export abstract class UserContract {
  abstract getUserInformationById(userId: Id): Observable<UserEntity>;
  abstract getUsersByIds(userIds: Id[]): Observable<UserEntity[]>;
  abstract addTeamParticipation(userId: Id, teamParticipationEntity: TeamParticipationEntity): Observable<TeamParticipationEntity>;
  abstract deleteTeamParticipation(userId: Id, teamId: Id): Observable<boolean>;
  abstract createuser(user: UserEntity): Observable<UserEntity>;
  abstract getUserByDocument(document: string): Observable<UserEntity>;
  abstract getUserByUniqueFieldsUsecase(document: string, email: string): Observable<UserEntity[]>;
}
