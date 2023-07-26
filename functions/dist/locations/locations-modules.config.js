"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsModulesConfig = void 0;
const authorization_contract_1 = require("./domain/contracts/authorization.contract");
const location_contract_1 = require("./domain/contracts/location.contract");
const get_location_by_id_usecase_1 = require("./domain/usecases/get-locations-by-id/get-location-by-id.usecase");
const get_locations_by_ids_usecase_1 = require("./domain/usecases/get-locations-by-ids/get-locations-by-ids.usecase");
const get_locations_by_ratio_usecase_1 = require("./domain/usecases/get-locations-by-ratio/get-locations-by-ratio.usecase");
const get_locations_usecase_1 = require("./domain/usecases/get-locations/get-locations.usecase");
const location_mapper_1 = require("./infrastructure/mappers/location.mapper");
const playground_mapper_1 = require("./infrastructure/mappers/playground.mapper");
const authorization_repository_1 = require("./infrastructure/repositories/authorization.repository");
const location_repository_1 = require("./infrastructure/repositories/location.repository");
class LocationsModulesConfig {
    static config(container) {
        container.add({
            id: 'PlaygroundMapper',
            kind: playground_mapper_1.PlaygroundMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'LocationMapper',
            kind: location_mapper_1.LocationMapper,
            dependencies: ['PlaygroundMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AuthorizationContract',
            kind: authorization_contract_1.AuthorizationContract,
            override: authorization_repository_1.AuthorizationRepository,
            strategy: 'singleton',
        });
        container.add({
            id: 'LocationContract',
            kind: location_contract_1.LocationContract,
            override: location_repository_1.LocationRepository,
            dependencies: ['DataSource', 'LocationMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetLocationsUsecase',
            kind: get_locations_usecase_1.GetLocationsUsecase,
            dependencies: ['LocationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetLocationsByRatioUsecase',
            kind: get_locations_by_ratio_usecase_1.GetLocationsByRatioUsecase,
            dependencies: ['LocationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetLocationByIdUsecase',
            kind: get_location_by_id_usecase_1.GetLocationByIdUsecase,
            dependencies: ['LocationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetLocationsByIdsUsecase',
            kind: get_locations_by_ids_usecase_1.GetLocationsByIdsUsecase,
            dependencies: ['GetLocationByIdUsecase'],
            strategy: 'singleton',
        });
    }
}
exports.LocationsModulesConfig = LocationsModulesConfig;
