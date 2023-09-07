import { Coordinate, LocationEntity } from '@deporty-org/entities/locations';
import { Observable } from 'rxjs';
export abstract class LocationContract {
  abstract getLocationsByRatioUsecase(
    origin: Coordinate,
    ratio: number
  ): Observable<LocationEntity[]>;
}
