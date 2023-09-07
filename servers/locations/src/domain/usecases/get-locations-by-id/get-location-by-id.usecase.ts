import { Id } from '@deporty-org/entities';
import { LocationEntity } from '@deporty-org/entities/locations';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LocationContract } from '../../contracts/location.contract';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export const LocationDoesNotExistError = generateError('LocationDoesNotExistError', 'The location with the id ${id} does not exist');

export class GetLocationByIdUsecase extends Usecase<Id, LocationEntity> {
  constructor(private locationContract: LocationContract) {
    super();
  }
  call(locationId: Id): Observable<LocationEntity> {
    return this.locationContract.getById(locationId).pipe(
      mergeMap((location: LocationEntity | undefined) => {
        if (!location) {
          return throwError(new LocationDoesNotExistError({ id: locationId }));
        }
        return of(location);
      })
    );
  }
}
