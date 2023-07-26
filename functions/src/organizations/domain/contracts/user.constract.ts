import { UserEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
export abstract class UserContract {
 abstract getUserInformationByEmail(email: string): Observable<UserEntity>;
}
