import { Id } from '@deporty-org/entities';
import { LocationEntity } from '@deporty-org/entities/locations';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { LocationContract } from '../../contracts/location.contract';
import { LocationDoesNotExistError } from '../location.exceptions';

export class GetLocationByIdUsecase extends Usecase<Id, LocationEntity> {
  constructor(private locationContract: LocationContract) {
    super();
  }
  call(locationId: Id): Observable<LocationEntity> {
    return this.locationContract.getById(locationId).pipe(
      mergeMap((location: LocationEntity | undefined) => {
        if (!location) {
          
          return throwError(new LocationDoesNotExistError(locationId));
        }
        return of(location);
      })
    );
  }
}
