"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLocationByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const location_exceptions_1 = require("../location.exceptions");
class GetLocationByIdUsecase extends usecase_1.Usecase {
    constructor(locationContract) {
        super();
        this.locationContract = locationContract;
    }
    call(locationId) {
        return this.locationContract.getById(locationId).pipe((0, operators_1.mergeMap)((location) => {
            if (!location) {
                return (0, rxjs_1.throwError)(new location_exceptions_1.LocationDoesNotExistError(locationId));
            }
            return (0, rxjs_1.of)(location);
        }));
    }
}
exports.GetLocationByIdUsecase = GetLocationByIdUsecase;
