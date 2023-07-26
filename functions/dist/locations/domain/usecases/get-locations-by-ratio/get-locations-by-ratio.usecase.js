"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLocationsByRatioUsecase = void 0;
const utilities_1 = require("@deporty-org/utilities");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetLocationsByRatioUsecase extends usecase_1.Usecase {
    constructor(locationContract) {
        super();
        this.locationContract = locationContract;
    }
    call(param) {
        const geoHashes = (0, utilities_1.generateQuadrants)(param.origin.latitude, param.origin.longitude, param.ratio);
        const quadrantsToSearch = geoHashes.quadrantsToSearch;
        const filters = [];
        for (const hash of quadrantsToSearch) {
            filters.push([
                {
                    operator: '>=',
                    value: hash,
                },
                {
                    operator: '<',
                    value: hash + '~',
                },
            ]);
        }
        const temp = [];
        for (const x of filters) {
            temp.push(this.locationContract.filter({
                ['geohash' + geoHashes.currentBase]: x,
            }));
        }
        return temp.length > 0
            ? (0, rxjs_1.zip)(...temp).pipe((0, operators_1.map)((dataArray) => {
                const data = [];
                for (const dat of dataArray) {
                    data.push(...dat);
                }
                return data;
            }), (0, operators_1.map)((locations) => {
                var _a, _b;
                const response = [];
                for (const loc of locations) {
                    if (loc.coordinate) {
                        const distance = (0, utilities_1.getDistance)(param.origin.latitude, param.origin.longitude, (_a = loc.coordinate) === null || _a === void 0 ? void 0 : _a.latitude, (_b = loc.coordinate) === null || _b === void 0 ? void 0 : _b.longitude);
                        if (distance <= param.ratio) {
                            response.push(loc);
                        }
                    }
                }
                return response;
            }))
            : (0, rxjs_1.of)([]);
    }
}
exports.GetLocationsByRatioUsecase = GetLocationsByRatioUsecase;
