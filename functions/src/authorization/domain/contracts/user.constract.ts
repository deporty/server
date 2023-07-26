import { Id, UserEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
export abstract class UserContract {
 abstract getUserInformationById(userId: Id): Observable<UserEntity>;
 abstract getUserInformationByEmail(email: string): Observable<UserEntity>;
}
