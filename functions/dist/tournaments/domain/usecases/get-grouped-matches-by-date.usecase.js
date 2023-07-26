"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupedMatchesByDateUsecase = void 0;
const moment = require("moment");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetGroupedMatchesByDateUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(params) {
        moment.locale('es');
        return this.tournamentContract
            .getAllMatchesWithTeams(params.tournamentId, params.stageId)
            .pipe((0, operators_1.map)((data) => {
            const response = {};
            for (const label in data) {
                if (Object.prototype.hasOwnProperty.call(data, label)) {
                    if (!response[label]) {
                        response[label] = {};
                    }
                    const matches = data[label];
                    for (const match of matches) {
                        const date = match['date'];
                        let transformedDate = 'unscheduled';
                        if (!!date) {
                            transformedDate = moment(date).format('dddd D MMM YYYY');
                        }
                        if (!response[label][transformedDate]) {
                            response[label][transformedDate] = [];
                        }
                        response[label][transformedDate].push(match);
                    }
                }
            }
            return response;
        }));
    }
}
exports.GetGroupedMatchesByDateUsecase = GetGroupedMatchesByDateUsecase;
