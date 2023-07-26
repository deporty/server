"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentLayoutConsumer = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const tournaments_constants_1 = require("../infrastructure/tournaments.constants");
class TournamentLayoutConsumer {
    getTournamentLayoutByIdUsecase(organizationId, tournamentLayoutId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.ORGANIZATION_SERVER}/${organizationId}/tournament-layout/${tournamentLayoutId}`, {
                headers: {
                    Authorization: 'Bearer f599e916-841b-4a1b-aa0a-65fefcaadf09',
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'ORGANIZATION:GET-BY-ID:SUCCESS') {
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
exports.TournamentLayoutConsumer = TournamentLayoutConsumer;
