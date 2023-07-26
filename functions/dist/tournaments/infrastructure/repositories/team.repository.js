"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const team_contract_1 = require("../../domain/contracts/team.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class TeamRepository extends team_contract_1.TeamContract {
    getTeamById(teamId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.TEAM_SERVER}/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${tournaments_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'TEAM:GET-BY-ID:SUCCESS') {
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
    getMemberById(teamId, memberId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.TEAM_SERVER}/${teamId}/member/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${tournaments_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'TEAM:GET-MEMBER-BY-ID:SUCCESS') {
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
    getMembersByTeam(teamId) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.TEAM_SERVER}/${teamId}/members`, {
                headers: {
                    Authorization: `Bearer ${tournaments_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === 'TEAM:GET-MEMBERS-BY-TEAM-ID:SUCCESS') {
                    observer.next(data.data);
                }
                else {
                    observer.next([]);
                }
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
            });
        });
    }
}
exports.TeamRepository = TeamRepository;
