"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const team_contract_1 = require("../../domain/contracts/team.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class TeamRepository extends team_contract_1.TeamContract {
    getTeamByFullFilters(filter) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .post(`${tournaments_constants_1.TEAM_SERVER}/advanced-filter`, filter, {
                headers: {
                    Authorization: `Bearer ${tournaments_constants_1.BEARER_TOKEN}`,
                },
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === "TEAM:GET:SUCCESS") {
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
    getTeamByFilters(filter) {
        return new rxjs_1.Observable((observer) => {
            axios_1.default
                .get(`${tournaments_constants_1.TEAM_SERVER}/filter`, {
                headers: {
                    Authorization: `Bearer ${tournaments_constants_1.BEARER_TOKEN}`,
                },
                params: filter,
            })
                .then((response) => {
                const data = response.data;
                if (data.meta.code === "TEAM:GET:SUCCESS") {
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
                if (data.meta.code === "TEAM:GET-BY-ID:SUCCESS") {
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
                if (data.meta.code === "TEAM:GET-MEMBER-BY-ID:SUCCESS") {
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
                if (data.meta.code === "TEAM:GET-MEMBERS-BY-TEAM-ID:SUCCESS") {
                    observer.next(data.data.map((x) => {
                        return Object.assign(Object.assign({}, x), { member: Object.assign(Object.assign({}, x.member), { initDate: x.member.initDate
                                    ? new Date(x.member.initDate)
                                    : undefined, retirementDate: x.member.retirementDate
                                    ? new Date(x.member.retirementDate)
                                    : undefined }) });
                    }));
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
