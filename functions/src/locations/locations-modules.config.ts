import { Container } from '../core/DI';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { LocationContract } from './domain/contracts/location.contract';
import { GetLocationByIdUsecase } from './domain/usecases/get-locations-by-id/get-location-by-id.usecase';
import { GetLocationsByIdsUsecase } from './domain/usecases/get-locations-by-ids/get-locations-by-ids.usecase';
import { GetLocationsByRatioUsecase } from './domain/usecases/get-locations-by-ratio/get-locations-by-ratio.usecase';
import { GetLocationsUsecase } from './domain/usecases/get-locations/get-locations.usecase';
import { LocationMapper } from './infrastructure/mappers/location.mapper';
import { PlaygroundMapper } from './infrastructure/mappers/playground.mapper';
import { AuthorizationRepository } from './infrastructure/repositories/authorization.repository';
import { LocationRepository } from './infrastructure/repositories/location.repository';

export class LocationsModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'PlaygroundMapper',
      kind: PlaygroundMapper,
      strategy: 'singleton',
    });

    container.add({
      id: 'LocationMapper',
      kind: LocationMapper,
      dependencies: ['PlaygroundMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'AuthorizationContract',
      kind: AuthorizationContract,
      override: AuthorizationRepository,
      strategy: 'singleton',
    });
    container.add({
      id: 'LocationContract',
      kind: LocationContract,
      override: LocationRepository,
      dependencies: ['DataSource', 'LocationMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetLocationsUsecase',
      kind: GetLocationsUsecase,
      dependencies: ['LocationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetLocationsByRatioUsecase',
      kind: GetLocationsByRatioUsecase,
      dependencies: ['LocationContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetLocationByIdUsecase',
      kind: GetLocationByIdUsecase,
      dependencies: ['LocationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetLocationsByIdsUsecase',
      kind: GetLocationsByIdsUsecase,
      dependencies: ['GetLocationByIdUsecase'],
      strategy: 'singleton',
    });
  }
}
