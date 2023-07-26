import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IBaseResponse, Id, UserEntity } from '@deporty-org/entities';
import { UserContract } from '../../domain/contracts/user.constract';
import { BEARER_TOKEN, USERS_SERVER } from '../teams.constants';
export class UserRepository extends UserContract {
  getUserInformationById(userId: Id): Observable<UserEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<UserEntity>>(`${USERS_SERVER}/${userId}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
  
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<UserEntity>;
          if (data.meta.code === 'USER:GET-BY-ID:SUCCESS') {
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
