"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentController = void 0;
const controller_1 = require("../../core/controller/controller");
const helpers_1 = require("../../core/helpers");
const tournaments_constants_1 = require("./tournaments.constants");
class TournamentController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        const authorizedUserMiddleware = container.getInstance("IsAuthorizedUserMiddleware").instance;
        const validator = (resourceName) => authorizedUserMiddleware.getValidator(resourceName, tournaments_constants_1.JWT_SECRET);
        app.get(`/ready`, controller_1.readyHandler);
        // app.get(`/intergroup-match`, (request: Request, response: Response) => {
        //   const params = request.query;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: {
        //       code: 'GET-MAIN-DRAW:SUCCESS',
        //       message: 'The main draw was returned',
        //     },
        //   };
        //   this.handlerController<GetIntergroupMatchUsecase, any>(
        //     container,
        //     'GetIntergroupMatchUsecase',
        //     response,
        //     config,
        //     undefined,
        //     params
        //   );
        // });
        app.put(`/match-sheet`, (request, response) => {
            const params = request.body;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "CreateMatchSheetUsecase", response, config, undefined, params);
        });
        app.get(`/:tournamentId/grouped-matches`, (request, response) => {
            const params = request.params.tournamentId;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "GetAllMatchesGroupedByDateUsecase", response, config, undefined, params);
        });
        // app.get(`/all-match-sheet`, (request: Request, response: Response) => {
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: {
        //       code: 'GET-MAIN-DRAW:SUCCESS',
        //       message: 'The main draw was returned',
        //     },
        //   };
        //   this.handlerController<GetAllMatchSheetsByTournamentUsecase, any>(
        //     container,
        //     'GetAllMatchSheetsByTournamentUsecase',
        //     response,
        //     config,
        //     undefined,
        //     undefined
        //   );
        // });
        app.post(`/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`, validator("AddIntergroupMatchUsecase"), (request, response) => {
            const params = request.body;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "AddIntergroupMatchUsecase", response, config, undefined, params);
        });
        app.get(`/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`, (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "GetIntergroupMatchesUsecase", response, config, undefined, Object.assign(Object.assign({}, params), { states: request.query.states }));
        });
        app.delete(`/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match/:intergroupMatchId`, validator("DeleteIntergroupMatchUsecase"), (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "DeleteIntergroupMatchUsecase", response, config, undefined, params);
        });
        app.patch(`/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`, validator("EditIntergroupMatchUsecase"), (request, response) => {
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "EDITED-INTERGROUP-MATCH:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "EditIntergroupMatchUsecase", response, config, undefined, Object.assign(Object.assign({}, request.params), { intergroupMatch: Object.assign(Object.assign({}, request.body), { match: Object.assign(Object.assign({}, request.body.match), { date: request.body.match.date
                            ? (0, helpers_1.getDateFromSeconds)(request.body.match.date)
                            : undefined }) }) }));
        });
        app.get(`/markers-table/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {
                    name: id,
                },
            };
            this.handlerController(container, "GetMarkersTableUsecase", response, config, undefined, id);
        });
        app.get(`/by-position`, validator("GetTournamentsByRatioUsecase"), (request, response) => {
            const params = request.query;
            const id = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {
                    name: id,
                },
            };
            this.handlerController(container, "GetTournamentsByRatioUsecase", response, config, undefined, {
                origin: {
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude),
                },
                ratio: parseFloat(params.ratio),
            });
        });
        app.put(`/:id/cost`, validator("CalculateTournamentCostByIdUsecase"), (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {
                    name: id,
                },
            };
            this.handlerController(container, "CalculateTournamentCostByIdUsecase", response, config, undefined, id);
        });
        // app.put(`/:id/invoices`, (request: Request, response: Response) => {
        //   const id = request.params.id;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: 'GET:SUCCESS',
        //     extraData: {
        //       name: id,
        //     },
        //   };
        //   this.handlerController<CalculateTournamentInvoicesById, any>(
        //     container,
        //     'CalculateTournamentInvoicesById',
        //     response,
        //     config,
        //     undefined,
        //     id
        //   );
        // });
        // app.put(`/fixture-group`, (request: Request, response: Response) => {
        //   const params = request.body;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: 'FIXTURE-GROUP:SUCCESS',
        //     extraData: {
        //       ...params,
        //     },
        //   };
        //   this.handlerController<GetMarkersTableUsecase, any>(
        //     container,
        //     'CreateFixtureByGroupUsecase',
        //     response,
        //     config,
        //     undefined,
        //     params
        //   );
        // });
        app.put(`/add-team`, validator("AddTeamsToTournamentUsecase"), (request, response) => {
            const params = request.body;
            const config = {
                exceptions: {
                    TeamWasAlreadyRegistered: "TEAM-ALREADY-REGISTERED:ERROR",
                    TeamDoesNotHaveMembers: "TEAM-WITH-OUT-MEMBERS:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "TEAM-ALREADY-REGISTERED:ERROR": "{message}",
                    "TEAM-WITH-OUT-MEMBERS:ERROR": "{message}",
                },
                successCode: "TEAM-REGISTERED:SUCCESS",
                extraData: Object.assign({}, params),
            };
            this.handlerController(container, "AddTeamsToTournamentUsecase", response, config, undefined, params);
        });
        app.get(`/available-teams-to-add/:id`, validator("GetPosibleTeamsToAddUsecase"), (request, response) => {
            const tournamentId = request.params.id;
            const query = request.query;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-AVAILABLE-TEAMS:SUCCESS",
                    message: 'Available teams for the tournament with id "{id}"',
                },
                extraData: {
                    id: tournamentId,
                },
            };
            this.handlerController(container, "GetPosibleTeamsToAddUsecase", response, config, undefined, Object.assign({ tournamentId }, query));
        });
        app.get(`/`, validator("GetTournamentsUsecase"), (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "GetTournamentsUsecase", response, config, undefined, params);
        });
        app.get(`/current-tournaments`, (request, response) => {
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "GetCurrentTournamentsUsecase", response, config, undefined);
        });
        app.get(`/get-matches-by-date/:date`, (request, response) => {
            const date = new Date(request.params.date);
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "GetAllMatchesByDateUsecase", response, config, undefined, date);
        });
        app.get(`/by-organization-and-tournament-layout`, (request, response) => {
            const params = request.query;
            params["includeDraft"] = params["includeDraft"] == "true";
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "GetTournamentsByOrganizationAndTournamentLayoutUsecase", response, config, undefined, params);
        });
        app.delete(`/:tournamentLayoutId`, validator("DeleteTournamentUsecase"), (request, response) => {
            const params = request.params.tournamentLayoutId;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "DELETE:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "DeleteTournamentUsecase", response, config, undefined, params);
        });
        // app.get(`/grouped-matches`, (request: Request, response: Response) => {
        //   const params = request.query;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: 'GET:SUCCESS',
        //     extraData: {},
        //   };
        //   this.handlerController<GetGroupedMatchesByDateUsecase, any>(
        //     container,
        //     'GetGroupedMatchesByDateUsecase',
        //     response,
        //     config,
        //     undefined,
        //     params
        //   );
        // });
        app.get(`/:id/fixture-stages`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "GET:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "GetFixtureStagesByTournamentUsecase", response, config, undefined, id);
        });
        app.post(`/:id/fixture-stage`, validator("CreateFixtureStageUsecase"), (request, response) => {
            const body = request.body;
            const config = {
                exceptions: {
                    FixtureStageAlreadyExistsError: "FIXTURE-ALREADY-EXISTS:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "FIXTURE-ALREADY-EXISTS:ERROR": "{message}",
                },
                successCode: "FIXTURE-STAGE-SAVE:SUCCESS",
                extraData: {},
            };
            this.handlerController(container, "CreateFixtureStageUsecase", response, config, undefined, body);
        });
        // app.get(
        //   `/match-inside-group`,
        //   (request: Request, response: Response) => {
        //     const params = request.query;
        //     const config: IMessagesConfiguration = {
        //       exceptions: {},
        //       identifier: this.identifier,
        //       errorCodes: {},
        //       successCode: {
        //         code: 'GET-MATCH:SUCCESS',
        //         message: 'The match was returned',
        //       },
        //     };
        //     this.handlerController<GetMatchInsideGroup, any>(
        //       container,
        //       'GetMatchInsideGroup',
        //       response,
        //       config,
        //       undefined,
        //       params
        //     );
        //   }
        // );
        app.get(`/:tournamentId/fixture-stage/:fixtureStageId/groups`, (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-NOT-FOUNDED:ERROR": "{message}",
                },
                successCode: "GET-GROUPS-IN-FIXTURE-STAGES:SUCCESS",
            };
            this.handlerController(container, "GetGroupsByFixtureStageUsecase", response, config, undefined, params);
        });
        app.delete(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`, validator("DeleteGroupByIdUsecase"), (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {
                    GroupDoesNotExist: "GROUP-NOT-FOUND:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-NOT-FOUND:ERROR": "{message}",
                },
                successCode: "GROUP-DELETED:SUCCESS",
            };
            this.handlerController(container, "DeleteGroupByIdUsecase", response, config, undefined, params);
        });
        app.delete(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/teams`, validator("DeleteTeamsInGroupUsecase"), (request, response) => {
            const params = request.params;
            const teamIds = request.body;
            params.teamIds = teamIds;
            const config = {
                exceptions: {
                    GroupDoesNotExist: "GROUP-NOT-FOUND:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-NOT-FOUND:ERROR": "{message}",
                },
                successCode: "TEAMS-DELETED-FROM-GROUP:SUCCESS",
            };
            this.handlerController(container, "DeleteTeamsInGroupUsecase", response, config, undefined, params);
        });
        app.post(`/:tournamentId/fixture-stage/:fixtureStageId/group`, validator("SaveGroupUsecase"), (request, response) => {
            const params = Object.assign(Object.assign({}, request.params), { group: request.body });
            const config = {
                exceptions: {
                    GroupAlreadyExistsError: "GROUP-ALREADY-EXISTS:ERROR",
                    LabelMustBeProvidedError: "LABEL-NOT-PROVIDED:ERROR",
                    OrderMustBeProvidedError: "ORDER-NOT-PROVIDED:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-ALREADY-EXISTS:ERROR": "{message}",
                    "ORDER-NOT-PROVIDED:ERROR": "{message}",
                    "LABEL-NOT-PROVIDED:ERROR": "{message}",
                },
                successCode: "GROUP-SAVED:SUCCESS",
            };
            this.handlerController(container, "SaveGroupUsecase", response, config, undefined, params);
        });
        app.get(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`, validator("GetGroupByIdUsecase"), (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {
                    GroupDoesNotExist: "GROUP-NOT-FOUND:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-NOT-FOUND:ERROR": "{message}",
                },
                successCode: {
                    code: "GET-GROUP:SUCCESS",
                    message: "The group was found succesfully",
                },
            };
            this.handlerController(container, "GetGroupByIdUsecase", response, config, undefined, params);
        });
        app.patch(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`, validator("UpdateGroupUsecase"), (request, response) => {
            const params = request.params;
            const body = request.body;
            body.id = request.params.groupId;
            const config = {
                exceptions: {
                    GroupDoesNotExist: "GROUP-NOT-FOUND:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-NOT-FOUND:ERROR": "{message}",
                },
                successCode: {
                    code: "UPDATED-GROUP:SUCCESS",
                    message: "The group was upadted succesfully",
                },
            };
            this.handlerController(container, "UpdateGroupUsecase", response, config, undefined, Object.assign(Object.assign({}, params), { group: body }));
        });
        app.patch(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/udpate-teams`, validator("UpdateTeamsInGroupUsecase"), (request, response) => {
            const params = request.params;
            const body = request.body;
            const data = Object.assign(Object.assign({}, params), { teamIds: body.teamIds });
            body.id = request.params.groupId;
            const config = {
                exceptions: {
                    GroupDoesNotExist: "GROUP-NOT-FOUND:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GROUP-NOT-FOUND:ERROR": "{message}",
                },
                successCode: {
                    code: "UPDATED-TEAMS-IN-GROUP:SUCCESS",
                    message: "The teams was updated into the group succesfully",
                },
            };
            this.handlerController(container, "UpdateTeamsInGroupUsecase", response, config, undefined, data);
        });
        app.get(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/matches`, (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "MATCHES-FOUND:SUCCESS",
            };
            this.handlerController(container, "GetGroupMatchesUsecase", response, config, undefined, Object.assign(Object.assign({}, params), { states: request.query.states }));
        });
        app.delete(`/:tournamentId/fixture-stage/:fixtureStageId`, validator("DeleteFixtureStageUsecase"), (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "FIXTURE-STAGE-DELETED:SUCCESS",
            };
            this.handlerController(container, "DeleteFixtureStageUsecase", response, config, undefined, params);
        });
        app.get(`/:id/registered-teams`, (request, response) => {
            const params = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-GROUP:SUCCESS",
                    message: "The registered teams was returned",
                },
            };
            this.handlerController(container, "GetRegisteredTeamsByTournamentIdUsecase", response, config, undefined, params);
        });
        app.delete(`/:tournamentId/registered-teams/:registeredTeamId`, validator("DeleteRegisteredTeamByIdUsecase"), (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "REGISTERED-TEAM-DELETED:SUCCESS",
                    message: "The registered teams was returned",
                },
            };
            this.handlerController(container, "DeleteRegisteredTeamByIdUsecase", response, config, undefined, params);
        });
        app.patch(`/:tournamentId/registered-team/:registeredTeamId/modify-status`, validator("ModifyRegisteredTeamStatusUsecase"), (request, response) => {
            const params = request.params;
            const status = request.body;
            const config = {
                exceptions: {
                    NotAllowedStatusModificationError: "MODIFY-REGISTERED-TEAM-STATUS:ERROR",
                    RegisteredTeamDoesNotExist: "REGISTERED-TEAM-DOES-NOT-EXISTS:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "MODIFY-REGISTERED-TEAM-STATUS:ERROR": "{message}",
                    "REGISTERED-TEAM-DOES-NOT-EXISTS:ERROR": "{message}",
                },
                successCode: {
                    code: "MODIFY-REGISTERED-TEAM:SUCCESS",
                    message: "The registered teams was modified",
                },
            };
            this.handlerController(container, "ModifyRegisteredTeamStatusUsecase", response, config, undefined, Object.assign(Object.assign({}, params), status));
        });
        app.get(`/:id`, 
        // validator('GetTournamentByIdUsecase'),
        (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    TournamentDoesNotExistError: "GET:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "GET:ERROR": "{message}",
                },
                successCode: "GET:SUCCESS",
                extraData: {
                    name: id,
                },
            };
            this.handlerController(container, "GetTournamentByIdUsecase", response, config, undefined, id);
        });
        app.put(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/match`, validator("EditMatchInsideGroupUsecase"), (request, response) => {
            const params = request.body;
            const query = request.params;
            const config = {
                exceptions: {
                    MatchDoesNotExist: "MATCH-DOES-NOT-EXIST:ERROR",
                    StageDoesNotExist: "STAGE-DOES-NOT-EXIST:ERROR",
                    GroupDoesNotExist: "GROUP-DOES-NOT-EXIST:ERROR",
                    MatchIsCompletedError: "MATCH-IS-ALREADY-COMPLETE:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "MATCH-DOES-NOT-EXIST:ERROR": "{message}",
                    "STAGE-DOES-NOT-EXIST:ERROR": "{message}",
                    "GROUP-DOES-NOT-EXIST:ERROR": "{message}",
                    "MATCH-IS-ALREADY-COMPLETE:ERROR": "{message}",
                },
                successCode: "MATCH-EDITED:SUCCESS",
                extraData: Object.assign({}, params),
            };
            this.handlerController(container, "EditMatchInsideGroupUsecase", response, config, undefined, Object.assign({ match: Object.assign(Object.assign({}, params), { date: params.date ? (0, helpers_1.getDateFromSeconds)(params.date) : undefined }) }, query));
        });
        app.post(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/match`, validator("AddMatchToGroupInsideTournamentUsecase"), (request, response) => {
            const body = request.body;
            const params = request.params;
            const config = {
                exceptions: {
                    MatchWasAlreadyRegistered: "MATCH-ALREADY-REGISTERED:ERROR",
                    StageDoesNotExist: "STAGE-DOES-NOT-EXIST:ERROR",
                    GroupDoesNotExist: "GROUP-DOES-NOT-EXIST:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "MATCH-ALREADY-REGISTERED:ERROR": "{message}",
                    "STAGE-DOES-NOT-EXIST:ERROR": "{message}",
                    "GROUP-DOES-NOT-EXIST:ERROR": "{message}",
                },
                successCode: "MATCH-REGISTERED:SUCCESS",
                extraData: Object.assign(Object.assign({}, body), params),
            };
            this.handlerController(container, "AddMatchToGroupInsideTournamentUsecase", response, config, undefined, Object.assign(Object.assign({}, body), params));
        });
        app.patch(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/complete-matches`, validator("AddMatchToGroupInsideTournamentUsecase"), (request, response) => {
            const body = request.body;
            const params = request.params;
            const config = {
                exceptions: {
                    MatchWasAlreadyRegistered: "MATCH-ALREADY-REGISTERED:ERROR",
                    StageDoesNotExist: "STAGE-DOES-NOT-EXIST:ERROR",
                    GroupDoesNotExist: "GROUP-DOES-NOT-EXIST:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "MATCH-ALREADY-REGISTERED:ERROR": "{message}",
                    "STAGE-DOES-NOT-EXIST:ERROR": "{message}",
                    "GROUP-DOES-NOT-EXIST:ERROR": "{message}",
                },
                successCode: "MATCH-REGISTERED:SUCCESS",
                extraData: Object.assign(Object.assign({}, body), params),
            };
            this.handlerController(container, "GetNewMatchesToAddInGroupUsecase", response, config, undefined, Object.assign(Object.assign({}, body), params));
        });
        app.put(`/add-teams-into-group`, validator("AddTeamsToGroupInsideTournamentUsecase"), (request, response) => {
            const params = request.body;
            const config = {
                exceptions: {
                    ThereAreTeamRegisteredPreviuslyError: "TEAM-IS-ALREADY-IN-THE-GROUP:ERROR",
                    TeamAreRegisteredInOtherGroupError: "TEAM-IS-ALREADY-IN-OTHER-GROUP:ERROR",
                    TeamAreNotRegisteredError: "TEAM-ARE-NOT-REGISTERED-IN-TOURNAMENT:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "TEAM-IS-ALREADY-IN-THE-GROUP:ERROR": "{message}",
                    "TEAM-IS-ALREADY-IN-OTHER-GROUP:ERROR": "{message}",
                    "TEAM-ARE-NOT-REGISTERED-IN-TOURNAMENT:ERROR": "{message}",
                },
                successCode: "TEAM-REGISTERED-INTO-GROUP:SUCCESS",
                extraData: Object.assign({}, params),
            };
            this.handlerController(container, "AddTeamsToGroupInsideTournamentUsecase", response, config, undefined, params);
        });
        // app.put(`/add-teams-into-group`, (request: Request, response: Response) => {
        //   const params = request.body;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {
        //       MatchWasAlreadyRegistered: 'MATCH-ALREADY-REGISTERED:ERROR',
        //       StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
        //       GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
        //     },
        //     identifier: this.identifier,
        //     errorCodes: {
        //       'MATCH-ALREADY-REGISTERED:ERROR': '{message}',
        //       'STAGE-DOES-NOT-EXIST:ERROR': '{message}',
        //       'GROUP-DOES-NOT-EXIST:ERROR': '{message}',
        //     },
        //     successCode: 'TEAM-REGISTERED-INTO-GROUP:SUCCESS',
        //     extraData: {
        //       ...params,
        //     },
        //   };
        //   this.handlerController<AddTeamsToGroupInsideTournamentUsecase, any>(
        //     container,
        //     'AddTeamsToGroupInsideTournamentUsecase',
        //     response,
        //     config,
        //     undefined,
        //     params
        //   );
        // });
        // app.put(`/main-draw/node-match`, (request: Request, response: Response) => {
        //   const params = request.body;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: {
        //       code: 'GET-MAIN-DRAW:SUCCESS',
        //       message: 'The main draw was returned',
        //     },
        //   };
        //   this.handlerController<EditMatchInMainDrawInsideTournamentUsecase, any>(
        //     container,
        //     'EditMatchInMainDrawInsideTournamentUsecase',
        //     response,
        //     config,
        //     undefined,
        //     params
        //   );
        // });
        // app.get(`/main-draw/node-match`, (request: Request, response: Response) => {
        //   const params = request.query;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: {
        //       code: 'GET-MAIN-DRAW:SUCCESS',
        //       message: 'The main draw was returned',
        //     },
        //   };
        //   this.handlerController<GetMatchInMainDrawInsideTournamentUsecase, any>(
        //     container,
        //     'GetMatchInMainDrawInsideTournamentUsecase',
        //     response,
        //     config,
        //     undefined,
        //     params
        //   );
        // });
        app.get(`/:id/main-draw`, (request, response) => {
            const tournamentId = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "GetMainDrawNodeMatchesoverviewUsecase", response, config, undefined, tournamentId);
        });
        app.get(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/positions-table`, validator("GetPositionsTableByGroupUsecase"), (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: "GET-MAIN-DRAW:SUCCESS",
                    message: "The main draw was returned",
                },
            };
            this.handlerController(container, "GetPositionsTableByGroupUsecase", response, config, undefined, params);
        });
        // app.get(`/:id/position-tables`, (request: Request, response: Response) => {
        //   const id = request.params.id;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: {
        //       code: 'GET-MAIN-DRAW:SUCCESS',
        //       message: 'The main draw was returned',
        //     },
        //   };
        //   this.handlerController<GetPositionsTableByStageUsecase, any>(
        //     container,
        //     'GetPositionsTableByStageUsecase',
        //     response,
        //     config,
        //     undefined,
        //     id
        //   );
        // });
        app.post(`/`, validator("CreateTournamentUsecase"), (request, response) => {
            const tournament = request.body;
            console.log("Llego ", tournament);
            const usecase = container.getInstance("FixtureStagesConfigurationMapper").instance;
            console.log("Usecase::: ", usecase);
            tournament["startsDate"] = new Date(Date.parse(tournament["startsDate"]));
            const config = {
                exceptions: {
                    Base64Error: "IMAGE:ERROR",
                    SizeError: "IMAGE:ERROR",
                    SizePropertyError: "IMAGE-SIZE-PROPERTY:ERROR",
                    EmptyAttributeError: "EMPTY-ATTRIBUTE:ERROR",
                    TournamentLayoutNotFoundError: "TOURNAMENT-LAYOUT-NOT-FOUND:ERROR",
                    OrganizationNotFoundError: "ORGANIZATION-NOT-FOUND:ERROR",
                    TournamentAlreadyExistsError: "TOURNAMENT-ALREADY-EXISTS:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "IMAGE:ERROR": "{message}",
                    "IMAGE-SIZE-PROPERTY:ERROR": "{message}",
                    "EMPTY-ATTRIBUTE:ERROR": "{message}",
                    "TOURNAMENT-LAYOUT-NOT-FOUND:ERROR": "{message}",
                    "ORGANIZATION-NOT-FOUND:ERROR": "{message}",
                    "TOURNAMENT-ALREADY-EXISTS:ERROR": "{message}",
                },
                successCode: "TOURNAMENT-CREATED:SUCCESS",
            };
            this.handlerController(container, "CreateTournamentUsecase", response, config, undefined, tournament);
        });
        app.get(`/:id/register-qr`, validator("GetRegisterTeamQRUsecase"), (request, response) => {
            const tournament = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "TOURNAMENT-CREATED:SUCCESS",
            };
            this.handlerController(container, "GetRegisterTeamQRUsecase", response, config, undefined, tournament);
        });
        app.patch(`/:id/modify-status`, validator("ModifyTournamentStatusUsecase"), (request, response) => {
            const body = request.body;
            const data = Object.assign(Object.assign({}, body), { tournamentId: request.params.id });
            const config = {
                exceptions: {
                    NotAllowedStatusModificationError: "MODIFY-STATUS:ERROR",
                },
                identifier: this.identifier,
                errorCodes: {
                    "MODIFY-STATUS:ERROR": "{message}",
                },
                successCode: "MODIFY-STATUS:SUCCESS",
                extraData: {
                    name: body,
                },
            };
            this.handlerController(container, "ModifyTournamentStatusUsecase", response, config, undefined, data);
        });
        app.patch(`/:id/modify-locations`, validator("ModifyTournamentLocationsUsecase"), (request, response) => {
            const body = request.body;
            const data = Object.assign(Object.assign({}, body), { tournamentId: request.params.id });
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "MODIFY-LOCATIONS:SUCCESS",
                extraData: {
                    name: body,
                },
            };
            this.handlerController(container, "ModifyTournamentLocationsUsecase", response, config, undefined, data);
        });
        app.patch(`/:id/modify-referees`, validator("ModifyTournamentRefereesUsecase"), (request, response) => {
            const body = request.body;
            const data = Object.assign(Object.assign({}, body), { tournamentId: request.params.id });
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: "MODIFY-REFEREES:SUCCESS",
                extraData: {
                    name: body,
                },
            };
            this.handlerController(container, "ModifyTournamentRefereesUsecase", response, config, undefined, data);
        });
    }
}
exports.TournamentController = TournamentController;
TournamentController.identifier = "TOURNAMENT";
