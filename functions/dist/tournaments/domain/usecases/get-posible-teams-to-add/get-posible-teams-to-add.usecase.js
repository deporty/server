"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPosibleTeamsToAddUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetPosibleTeamsToAddUsecase extends usecase_1.Usecase {
    constructor(teamContract, registeredTeamsContract) {
        super();
        this.teamContract = teamContract;
        this.registeredTeamsContract = registeredTeamsContract;
    }
    call(params) {
        const $tournament = this.registeredTeamsContract
            .filter({
            tournamentId: params.tournamentId,
        }, {
            tournamentId: {
                operator: '==',
                value: params.tournamentId,
            },
        })
            .pipe((0, operators_1.mergeMap)((registeredTeams) => {
            const teams = registeredTeams.map((x) => x.teamId);
            const filters = {};
            if (teams.length > 0) {
                filters['id'] = {
                    operator: 'not-in',
                    value: teams,
                };
            }
            if (params.category) {
                filters['category'] = {
                    operator: '==',
                    value: params.category,
                };
            }
            if (params.name) {
                filters['name'] = {
                    operator: 'contains',
                    value: params.name,
                };
            }
            return this.teamContract.getTeamByFullFilters(filters);
        }));
        return $tournament;
    }
}
exports.GetPosibleTeamsToAddUsecase = GetPosibleTeamsToAddUsecase;
