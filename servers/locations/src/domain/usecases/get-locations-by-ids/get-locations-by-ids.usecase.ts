import { Id } from '@deporty-org/entities';
import { LocationEntity } from '@deporty-org/entities/locations';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetLocationByIdUsecase } from '../get-locations-by-id/get-location-by-id.usecase';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetLocationsByIdsUsecase extends Usecase<Id[], LocationEntity[]> {
  constructor(private getLocationByIdUsecase: GetLocationByIdUsecase) {
    super();
  }
  call(ids: Id[]): Observable<LocationEntity[]> {
    return ids.length > 0
      ? zip(
          ...ids.map((id) =>
            this.getLocationByIdUsecase
              .call(id)
              .pipe(catchError(() => of(undefined)))
          )
        ).pipe(
          map((data: (LocationEntity | undefined)[]) => {
            return data.filter((item) => !!item) as LocationEntity[];
          })
        )
      : of([]);
  }
}
