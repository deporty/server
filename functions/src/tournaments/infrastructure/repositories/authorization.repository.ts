import { RoleEntity } from "@deporty-org/entities/authorization";
import { Observable } from "rxjs";
import { AuthorizationContract } from "../../domain/contracts/authorization.contract";
import axios, { AxiosResponse } from 'axios';
import { IBaseResponse } from "@deporty-org/entities";
import { AUTHORIZATION_SERVER, BEARER_TOKEN } from "../tournaments.constants";

export class AuthorizationRepository extends AuthorizationContract{
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
  getRoleById(roleId: string): Observable<RoleEntity> {
    
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<RoleEntity>>(
          `${AUTHORIZATION_SERVER}/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<RoleEntity>;
          if (data.meta.code === 'AUTHORIZATION:GET-ROLE-BY-ID:SUCCESS') {
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