import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IBaseResponse, UserEntity } from '@deporty-org/entities';
import { UserContract } from '../../domain/contracts/user.constract';
import { BEARER_TOKEN, USERS_SERVER } from '../organizations.constants';
export class UserRepository extends UserContract {
  getUserInformationByEmail(email: string): Observable<UserEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<UserEntity>>(`${USERS_SERVER}/email/${email}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
  
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<UserEntity>;
          if (data.meta.code === 'USER:GET-BY-EMAIL:SUCCESS') {
            observer.next(data.data);
          } else {
            observer.error();
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
