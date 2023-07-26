"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSportByIdUsecase = exports.SportDoesNotExistError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class SportDoesNotExistError extends Error {
    constructor(id) {
        super(`The sport with the id ${id} does not exist`);
        this.name = 'SportDoesNotExistError';
    }
}
exports.SportDoesNotExistError = SportDoesNotExistError;
class GetSportByIdUsecase extends usecase_1.Usecase {
    constructor(sportRepository) {
        super();
        this.sportRepository = sportRepository;
    }
    call(id) {
        return this.sportRepository.getById(id).pipe((0, operators_1.mergeMap)((team) => {
            if (!!team) {
                return (0, rxjs_1.of)(team);
            }
            else {
                return (0, rxjs_1.throwError)(new SportDoesNotExistError(id));
            }
        }));
    }
}
exports.GetSportByIdUsecase = GetSportByIdUsecase;
