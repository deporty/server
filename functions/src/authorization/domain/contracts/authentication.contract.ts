import { Observable } from "rxjs";

export abstract class AuthenticationContract {
  abstract login(username: string, password: string): Observable<string>;
}
