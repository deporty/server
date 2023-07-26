"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentsByRatioUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetTournamentsByRatioUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, locationContract) {
        super();
        this.tournamentContract = tournamentContract;
        this.locationContract = locationContract;
    }
    call(param) {
        const $locations = this.locationContract.getLocationsByRatioUsecase(param.origin, param.ratio);
        return $locations.pipe((0, operators_1.mergeMap)((locations) => {
            if (locations.length > 0) {
                const filters = {
                    locations: {
                        operator: 'array-contains-any',
                        value: locations.map((x) => x.id),
                    },
                };
                // if (!param.includeDraft) {
                //   filters['status'] = {
                //     operator: 'not-in',
                //     value: ['draft', 'deleted'],
                //   };
                // }
                return this.tournamentContract.filter(filters);
            }
            else {
                return (0, rxjs_1.of)([]);
            }
        }));
    }
}
exports.GetTournamentsByRatioUsecase = GetTournamentsByRatioUsecase;
