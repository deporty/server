"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLocationsByIdsUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetLocationsByIdsUsecase extends usecase_1.Usecase {
    constructor(getLocationByIdUsecase) {
        super();
        this.getLocationByIdUsecase = getLocationByIdUsecase;
    }
    call(ids) {
        return ids.length > 0
            ? (0, rxjs_1.zip)(...ids.map((id) => this.getLocationByIdUsecase
                .call(id)
                .pipe((0, operators_1.catchError)(() => (0, rxjs_1.of)(undefined))))).pipe((0, operators_1.map)((data) => {
                return data.filter((item) => !!item);
            }))
            : (0, rxjs_1.of)([]);
    }
}
exports.GetLocationsByIdsUsecase = GetLocationsByIdsUsecase;
