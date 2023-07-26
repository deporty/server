"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationMapper = void 0;
const mapper_1 = require("../../../core/mapper");
const firestore_1 = require("firebase-admin/firestore");
const rxjs_1 = require("rxjs");
class LocationMapper extends mapper_1.Mapper {
    constructor(playgroundMapper) {
        super();
        this.playgroundMapper = playgroundMapper;
        this.attributesMapper = {
            id: { name: 'id' },
            name: { name: 'name' },
            coordinate: {
                name: 'coordinate',
                to: (value) => {
                    return new firestore_1.GeoPoint(value.latitude, value.longitude);
                },
                from: (value) => {
                    return (0, rxjs_1.of)({
                        latitude: value.latitude,
                        longitude: value.longitude,
                    });
                },
            },
            address: { name: 'address' },
            geohash32: { name: 'geohash32' },
            geohash64: { name: 'geohash64' },
            geohash128: { name: 'geohash128' },
            playgrounds: {
                name: 'playgrounds',
                to: (value) => {
                    return this.playgroundMapper.toJson(value);
                },
                // from: (value: any[]) => {
                //   return value.map((x) => this.playgroundMapper.fromJson(value));
                // },
            },
        };
    }
}
exports.LocationMapper = LocationMapper;
