"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMatchToGroupInsideTournamentUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class AddMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(matchContract) {
        super();
        this.matchContract = matchContract;
    }
    //TODO: Verificar que no exista otro partido igual en el mismo grupo
    call(param) {
        const match = {
            teamAId: param.teamAId,
            teamBId: param.teamBId,
            status: 'editing',
        };
        return this.matchContract
            .save({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        }, match)
            .pipe((0, operators_1.map)((id) => {
            return Object.assign(Object.assign({}, match), { id });
        }));
    }
}
exports.AddMatchToGroupInsideTournamentUsecase = AddMatchToGroupInsideTournamentUsecase;
