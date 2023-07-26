import { DataSource } from '../../../core/datasource';
import { LocationContract } from '../../domain/contracts/location.contract';
import { LocationMapper } from '../mappers/location.mapper';
import { LOCATIONS_ENTITY } from '../locations.constants';

export class LocationRepository extends LocationContract {
  static entity = LOCATIONS_ENTITY;
  constructor(
    protected dataSource: DataSource<any>,
    protected locationMapper: LocationMapper
  ) {
    super(dataSource, locationMapper);
    this.entity = LOCATIONS_ENTITY;
  }
}
