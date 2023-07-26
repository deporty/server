import { Observable } from 'rxjs';
import { Usecase } from '../../../../core/usecase';

export interface Param {
  username: string;
  password: string;
}
export class LoginUsecase extends Usecase<Param, string> {
  call(param: Param ): Observable<string> {





    throw new Error('Method not implemented.');
  }
}
