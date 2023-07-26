import {
  LocationEntity,
  PlaygroundEntity,
} from '@deporty-org/entities/locations';
import { Mapper } from '../../../core/mapper';
import { PlaygroundMapper } from './playground.mapper';
import { GeoPoint } from 'firebase-admin/firestore';
import { Coordinate } from '@deporty-org/entities/locations/location.entity';
import { of } from 'rxjs';

export class LocationMapper extends Mapper<LocationEntity> {
  constructor(private playgroundMapper: PlaygroundMapper) {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      name: { name: 'name' },
      coordinate: {
        name: 'coordinate',
        to: (value: Coordinate) => {
          return new GeoPoint(value.latitude, value.longitude);
        },
        from: (value: GeoPoint) => {
          return of({
            latitude: value.latitude,
            longitude: value.longitude,
          } as Coordinate);
        },
      },
      address: { name: 'address' },
      geohash32: { name: 'geohash32' },
      geohash64: { name: 'geohash64' },
      geohash128: { name: 'geohash128' },
      playgrounds: {
        name: 'playgrounds',
        to: (value: PlaygroundEntity) => {
          return this.playgroundMapper.toJson(value);
        },
        // from: (value: any[]) => {
        //   return value.map((x) => this.playgroundMapper.fromJson(value));
        // },
      },
    };
  }
}
