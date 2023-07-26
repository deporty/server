"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const controller_1 = require("../../core/controller/controller");
class TeamController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/delete/:id`, (request, response) => {
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
        app.get(`/`, (request, response) => {
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
            this.handlerController(container, 'GetTeamsUsecase', response, config);
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
            this.handlerPostController(container, 'CreateTeamUsecase', response, config, 'TeamMapper', team);
        });
        app.put(`/assign-player`, (request, response) => {
            const data = request.body;
            const config = {
                exceptions: {
                    PlayerIsAlreadyInTeamException: 'PLAYER-ALREADY-EXISTS:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'PLAYER-ALREADY-EXISTS:ERROR': '{message}',
                },
                successCode: {
                    code: 'PLAYER-ASSIGNED:SUCCESS',
                    message: 'The player was assigned.',
                },
                extraData: {
                    entitiesName: 'Team',
                },
            };
            this.handlerPostController(container, 'AsignPlayerToTeamUsecase', response, config, undefined, data);
        });
        app.get(`/by-registered-team/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: 'BY-REGISTERED-TEAM:SUCCESS',
                extraData: {
                    name: id,
                },
            };
            this.handlerController(container, 'GetActiveTournamentsByRegisteredTeamUsecase', response, config, undefined, id);
        });
    }
}
exports.TeamController = TeamController;
TeamController.identifier = 'TEAM';
