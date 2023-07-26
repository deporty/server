import { IBaseResponse } from '@deporty-org/entities';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { AuthorizationContract } from '../../domain/contracts/authorization.contract';
import { AUTHORIZATION_SERVER, BEARER_TOKEN } from '../teams.constants';

export class AuthorizationRepository extends AuthorizationContract {
  isAValidAccessKey(accessKey: string): Observable<boolean> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<boolean>>(
          `${AUTHORIZATION_SERVER}/access-key/${accessKey}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<boolean>;
          if (data.meta.code === 'AUTHORIZATION:VALID-ACCESS-KEY:SUCCESS') {
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
