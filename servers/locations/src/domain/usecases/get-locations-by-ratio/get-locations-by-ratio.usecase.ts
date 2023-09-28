import { LocationEntity } from '@deporty-org/entities/locations';
import { Coordinate } from '@deporty-org/entities/locations/location.entity';
import { generateQuadrants, getDistance } from '@scifamek-open-source/guatavita';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationContract } from '../../contracts/location.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export interface Param {
  origin: Coordinate;
  ratio: number;
}

export class GetLocationsByRatioUsecase extends Usecase<Param, LocationEntity[]> {
  constructor(private locationContract: LocationContract) {
    super();
  }

  call(param: Param): Observable<LocationEntity[]> {
    const geoHashes = generateQuadrants(param.origin.latitude, param.origin.longitude, param.ratio);

    const quadrantsToSearch = geoHashes.quadrantsToSearch;

    const filters: any[][] = [];

    for (const hash of quadrantsToSearch) {
      filters.push([
        {
          operator: '>=',
          value: hash,
        },
        {
          operator: '<',
          value: hash + '~',
        },
      ]);
    }
    const temp = [];
    for (const x of filters) {
      temp.push(
        this.locationContract.filter({
          ['geohash' + geoHashes.currentBase]: x,
        })
      );
    }
    return temp.length > 0
      ? zip(...temp).pipe(
          map((dataArray: LocationEntity[][]) => {
            const data = [];
            for (const dat of dataArray) {
              data.push(...dat);
            }
            return data;
          }),
          map((locations: LocationEntity[]) => {
            const response = [];
            for (const loc of locations) {
              if (loc.coordinate) {
                const distance = getDistance(
                  param.origin.latitude,
                  param.origin.longitude,
                  loc.coordinate?.latitude,
                  loc.coordinate?.longitude
                );
                if (distance <= param.ratio) {
                  response.push(loc);
                }
              }
            }
            return response;
          })
        )
      : of([]);
  }
}
