"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const controller_1 = require("../../core/controller/controller");
const teams_constants_1 = require("./teams.constants");
class TeamController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        const middleware = container.getInstance('IsAuthorizedUserMiddleware').instance;
        const validator = (i) => middleware.getValidator(i, teams_constants_1.JWT_SECRET);
        app.get(`/ready`, controller_1.readyHandler);
        app.delete(`/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    VariableNotDefinedException: 'DELETE:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'DELETE:ERROR': '{message}',
                },
                successCode: 'DELETE:SUCCESS',
                extraData: {
                    entitiesName: 'team',
                },
            };
            this.handlerController(container, 'DeleteTeamUsecase', response, config, undefined, id);
        });
        app.get(`/all`, validator('GetTeamsUsecase'), (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {
                    TeamAlreadyExistsException: 'GET:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ERROR': '{message}',
                },
                successCode: 'GET:SUCCESS',
                extraData: {
                    entitiesName: 'teams',
                },
            };
            this.handlerController(container, 'GetTeamsUsecase', response, config, undefined, params);
        });
        app.get(`/filter`, (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: 'GET:SUCCESS',
                extraData: {
                    entitiesName: 'teams',
                },
            };
            this.handlerController(container, 'GetTeamByFiltersUsecase', response, config, undefined, params);
        });
        app.get(`/name/:name`, (request, response) => {
            const name = request.params.name;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: 'GET:NAME:SUCCESS',
                    message: 'Information for team with name {name}',
                },
                extraData: {
                    name,
                },
            };
            this.handlerController(container, 'GetTeamByNameUsecase', response, config, undefined, name);
        });
        app.get(`/:id/members`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    TeamDoesNotExist: 'GET:ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET-MEMBERS-BY-TEAM-ID:SUCCESS',
                    message: 'Information for team with id {id}',
                },
                extraData: {
                    id: id,
                },
            };
            this.handlerController(container, 'GetMembersByTeamUsecase', response, config, undefined, id);
        });
        app.get(`/:teamId/member/:memberId`, (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {
                    MemberDoesNotExistException: 'GET-MEMBER-BY-ID:ERROR',
                    UserDoesNotExistException: 'GET-USER-BY-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-MEMBER-BY-ID:ERROR': '{message}',
                    'GET-USER-BY-ID:ERROR': '{message}',
                },
                successCode: 'GET-MEMBER-BY-ID:SUCCESS',
                extraData: {
                    id: params,
                },
            };
            this.handlerController(container, 'GetMemberByIdUsecase', response, config, undefined, params);
        });
        app.get(`/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    TeamDoesNotExist: 'GET:ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET:ID:SUCCESS',
                    message: 'Information for team with id {id}',
                },
                extraData: {
                    id: id,
                },
            };
            this.handlerController(container, 'GetTeamByIdUsecase', response, config, undefined, id);
        });
        app.get(`/sport/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    SportDoesNotExistError: 'GET-SPORT-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ID:ERROR': '{message}',
                },
                successCode: 'GET-SPORT-ID:SUCCESS',
                extraData: {
                    id: id,
                },
            };
            this.handlerController(container, 'GetSportByIdUsecase', response, config, undefined, id);
        });
        app.post(`/`, (request, response) => {
            const team = request.body;
            const config = {
                exceptions: {
                    TeamAlreadyExistsException: 'POST:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'POST:ERROR': '{message}',
                },
                successCode: 'POST:SUCCESS',
                extraData: {
                    entitiesName: 'Team',
                },
            };
            this.handlerPostController(container, 'CreateTeamUsecase', response, config, undefined, team);
        });
        // app.put(`/assign-player`, (request: Request, response: Response) => {
        //   const data = request.body;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {
        //       PlayerIsAlreadyInTeamException: 'PLAYER-ALREADY-EXISTS:ERROR',
        //     },
        //     identifier: this.identifier,
        //     errorCodes: {
        //       'PLAYER-ALREADY-EXISTS:ERROR': '{message}',
        //     },
        //     successCode: {
        //       code: 'PLAYER-ASSIGNED:SUCCESS',
        //       message: 'The player was assigned.',
        //     },
        //     extraData: {
        //       entitiesName: 'Team',
        //     },
        //   };
        //   this.handlerPostController<AsignPlayerToTeamUsecase, TeamEntity>(
        //     container,
        //     'AsignPlayerToTeamUsecase',
        //     response,
        //     config,
        //     undefined,
        //     data
        //   );
        // });
        // app.get(
        //   `/by-registered-team/:id`,
        //   (request: Request, response: Response) => {
        //     const id = request.params.id;
        //     const config: IMessagesConfiguration = {
        //       exceptions: {},
        //       identifier: this.identifier,
        //       errorCodes: {},
        //       successCode: 'BY-REGISTERED-TEAM:SUCCESS',
        //       extraData: {
        //         name: id,
        //       },
        //     };
        //     this.handlerController<
        //       GetActiveTournamentsByRegisteredTeamUsecase,
        //       any
        //     >(
        //       container,
        //       'GetActiveTournamentsByRegisteredTeamUsecase',
        //       response,
        //       config,
        //       undefined,
        //       id
        //     );
        //   }
        // );
    }
}
exports.TeamController = TeamController;
TeamController.identifier = 'TEAM';
