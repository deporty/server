import { Coordinate, LocationEntity } from '@deporty-org/entities/locations';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { LOCATION_SERVER } from '../tournaments.constants';
import { IBaseResponse } from '@deporty-org/entities';
import { LocationContract } from '../../domain/contracts/location.contract';
export  class LocationRepository extends LocationContract {
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
