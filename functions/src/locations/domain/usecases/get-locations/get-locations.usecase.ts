import { LocationEntity } from '@deporty-org/entities/locations';
import { Observable } from 'rxjs';
import { Pagination, Usecase } from '../../../../core/usecase';
import { LocationContract } from '../../contracts/location.contract';

export class GetLocationsUsecase extends Usecase<Pagination, LocationEntity[]> {
  constructor(private locationContract: LocationContract) {
    super();
  }

  call(params: Pagination): Observable<LocationEntity[]> {
    return this.locationContract.get(params);
  }
}
