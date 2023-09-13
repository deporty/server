import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';

export interface Param {
  username: string;
  password: string;
}
export class LoginUsecase extends Usecase<Param, string> {
  call(param: Param): Observable<string> {
    throw new Error('Method not implemented.');
  }
}
