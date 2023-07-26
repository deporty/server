"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentLayoutRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const tournament_layout_contract_1 = require("../../domain/contracts/tournament-layout.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class TournamentLayoutRepository extends tournament_layout_contract_1.TournamentLayoutContract {
    getTournamentLayoutByIdUsecase(organizationId, tournamentLayoutId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.ORGANIZATION_SERVER}/${organizationId}/tournament-layout/${tournamentLayoutId}`, {
                headers: {
                    Authorization: `Bearer ${tournaments_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'ORGANIZATION:GET-TOURNAMENT-LAYOUT-BY-ID:SUCCESS') {
                    observer.next(data.data);
                }
                else {
                    observer.error();
                }
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
            });
        });
    }
}
exports.TournamentLayoutRepository = TournamentLayoutRepository;
