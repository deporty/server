"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLocationsUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetLocationsUsecase extends usecase_1.Usecase {
    constructor(locationContract) {
        super();
        this.locationContract = locationContract;
    }
    call(params) {
        return this.locationContract.get(params);
    }
}
exports.GetLocationsUsecase = GetLocationsUsecase;
