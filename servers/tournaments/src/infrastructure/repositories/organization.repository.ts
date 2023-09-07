import { Coordinate, LocationEntity } from '@deporty-org/entities/locations';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IBaseResponse, Id } from '@deporty-org/entities';
import { OrganizationContract } from '../../domain/contracts/organization.contract';
import {
  BEARER_TOKEN,
  LOCATION_SERVER,
  ORGANIZATION_SERVER,
} from '../tournaments.constants';
import { OrganizationEntity, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
export class OrganizationRepository extends OrganizationContract {

  getTournamentLayoutByIdUsecase(
    organizationId: Id,
    tournamentLayoutId: Id
  ): Observable<TournamentLayoutEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<TournamentLayoutEntity>>(
          `${ORGANIZATION_SERVER}/${organizationId}/tournament-layout/${tournamentLayoutId}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
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
  
  getOrganizationById(organizationId: string): Observable<OrganizationEntity> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<OrganizationEntity>>(
          `${ORGANIZATION_SERVER}/${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        )
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<OrganizationEntity>;
          if (data.meta.code === 'ORGANIZATION:GET-BY-ID:SUCCESS') {
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
  getLocationsByRatioUsecase(
    origin: Coordinate,
    ratio: number
  ): Observable<LocationEntity[]> {
    return new Observable((observer) => {
      axios
        .get<IBaseResponse<LocationEntity[]>>(`${LOCATION_SERVER}/ratio`, {
          headers: {
            Authorization: 'Bearer f599e916-841b-4a1b-aa0a-65fefcaadf09',
          },
          params: {
            latitude: origin.latitude,
            longitude: origin.longitude,
            ratio,
          },
        })
        .then((response: AxiosResponse) => {
          const data = response.data as IBaseResponse<LocationEntity[]>;
          if (data.meta.code === 'LOCATION:GET:SUCCESS') {
            observer.next(data.data);
          } else {
            observer.next([]);
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
