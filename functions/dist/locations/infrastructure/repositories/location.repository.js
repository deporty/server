"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
const location_contract_1 = require("../../domain/contracts/location.contract");
const locations_constants_1 = require("../locations.constants");
class LocationRepository extends location_contract_1.LocationContract {
    constructor(dataSource, locationMapper) {
        super(dataSource, locationMapper);
        this.dataSource = dataSource;
        this.locationMapper = locationMapper;
        this.entity = locations_constants_1.LOCATIONS_ENTITY;
    }
}
exports.LocationRepository = LocationRepository;
LocationRepository.entity = locations_constants_1.LOCATIONS_ENTITY;
