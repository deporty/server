import { Id, UserEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
export abstract class UserContract {
  abstract getUserInformationById(userId: Id): Observable<UserEntity>;
  abstract getUsersByIds(userIds: Id[]): Observable<UserEntity[]>;
}
