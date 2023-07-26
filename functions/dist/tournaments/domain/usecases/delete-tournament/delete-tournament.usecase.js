"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class DeleteTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, getTournamentByIdUsecase, updateTournamentUsecase, fileAdapter) {
        super();
        this.tournamentContract = tournamentContract;
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
        this.fileAdapter = fileAdapter;
    }
    call(id) {
        return this.getTournamentByIdUsecase.call(id).pipe((0, operators_1.mergeMap)((tournament) => {
            if (tournament.status == 'draft') {
                return this.tournamentContract.delete(id).pipe((0, operators_1.mergeMap)(() => {
                    if (tournament.flayer) {
                        return this.fileAdapter
                            .deleteFile(tournament.flayer)
                            .pipe((0, operators_1.map)(() => null));
                    }
                    return (0, rxjs_1.of)(null);
                }));
            }
            else {
                tournament.status = 'deleted';
                return this.updateTournamentUsecase.call(tournament);
            }
        }));
    }
}
exports.DeleteTournamentUsecase = DeleteTournamentUsecase;
