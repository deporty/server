import { LocationEntity } from '@deporty-org/entities/locations';
import { Observable } from 'rxjs';
import { LocationContract } from '../../contracts/location.contract';
import { Pagination, Usecase } from '@scifamek-open-source/iraca/domain';

export class GetLocationsUsecase extends Usecase<Pagination, LocationEntity[]> {
  constructor(private locationContract: LocationContract) {
    super();
  }

  call(params: Pagination): Observable<LocationEntity[]> {
    return this.locationContract.get(params);
  }
}
