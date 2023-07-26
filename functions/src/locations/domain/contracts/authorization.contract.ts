import { Observable } from 'rxjs';

export abstract class AuthorizationContract {
  abstract isAValidAccessKey(accessKey: string): Observable<boolean>;
}
