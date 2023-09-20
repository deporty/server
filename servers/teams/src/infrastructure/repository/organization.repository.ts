import { IBaseResponse, Id } from '@deporty-org/entities';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { OrganizationContract } from '../../domain/contracts/organization.contract';

import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { BEARER_TOKEN, ORGANIZATION_SERVER } from '../teams.constants';
export class OrganizationRepository extends OrganizationContract {
  getTournamentLayoutByIdUsecase(organizationId: Id, tournamentLayoutId: Id): Observable<TournamentLayoutEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<TournamentLayoutEntity>>(`${ORGANIZATION_SERVER}/${organizationId}/tournament-layout/${tournamentLayoutId}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<TournamentLayoutEntity>;
          if (data.meta.code === 'ORGANIZATION:GET-TOURNAMENT-LAYOUT-BY-ID:SUCCESS') {
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
