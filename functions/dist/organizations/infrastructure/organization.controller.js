"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const controller_1 = require("../../core/controller/controller");
class OrganizationController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/ready`, controller_1.readyHandler);
        app.get(`/`, (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {
                    VariableNotDefinedException: 'GET:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ERROR': '{message}',
                },
                successCode: 'GET-BY-MEMBER:SUCCESS',
                extraData: {
                    entitiesName: 'team',
                },
            };
            this.handlerController(container, 'GetOrganizationsUsecase', response, config, undefined, params);
        });
        app.get(`/member/:id`, (request, response) => {
            const memberId = request.params.id;
            const config = {
                exceptions: {
                    VariableNotDefinedException: 'GET:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ERROR': '{message}',
                },
                successCode: 'GET-BY-MEMBER:SUCCESS',
                extraData: {
                    entitiesName: 'team',
                },
            };
            this.handlerController(container, 'GetOrganizationWhereExistsMemberIdUsecase', response, config, undefined, memberId);
        });
        app.get(`/member/email/:email`, (request, response) => {
            const email = request.params.email;
            const config = {
                exceptions: {
                    VariableNotDefinedException: 'GET-BY-MEMBER-EMAIL:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-MEMBER-EMAIL:ERROR': '{message}',
                },
                successCode: 'GET-BY-MEMBER-EMAIL:SUCCESS',
            };
            this.handlerController(container, 'GetOrganizationWhereExistsMemberEmailUsecase', response, config, undefined, email);
        });
        app.get(`/:organizationId/tournament-layouts`, (request, response) => {
            const organizationId = request.params.organizationId;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: 'GET-TOURNAMENT-LAYOUTS:SUCCESS',
            };
            this.handlerController(container, 'GetTournamentLayoutsByOrganizationIdUsecase', response, config, undefined, organizationId);
        });
        app.get(`/:organizationId`, (request, response) => {
            const organizationId = request.params.organizationId;
            const config = {
                exceptions: {
                    OrganizationNotFoundError: 'DOES-NOT-EXIST:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'DOES-NOT-EXIST:ERROR': '{message}',
                },
                successCode: 'GET-BY-ID:SUCCESS',
            };
            this.handlerController(container, 'GetOrganizationByIdUsecase', response, config, undefined, organizationId);
        });
        app.get(`/:organizationId/tournament-layout/:tournamentLayoutId`, (request, response) => {
            const params = request.params;
            const config = {
                exceptions: {
                    TournamentLayoutNotFoundError: 'DOES-NOT-EXIST:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'DOES-NOT-EXIST:ERROR': '{message}',
                },
                successCode: 'GET-TOURNAMENT-LAYOUT-BY-ID:SUCCESS',
            };
            this.handlerController(container, 'GetTournamentLayoutByIdUsecase', response, config, undefined, params);
        });
        app.post(`/tournament-layout`, (request, response) => {
            const body = request.body;
            const config = {
                exceptions: {
                    Base64Error: 'IMAGE:ERROR',
                    SizeError: 'IMAGE:ERROR',
                    SizePropertyError: 'IMAGE-SIZE-PROPERTY:ERROR',
                    TournamentLayoutAlreadyExistsError: 'TOURNAMENT-LAYOUT-ALREADY-EXISTS:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'IMAGE:ERROR': '{message}',
                    'IMAGE-SIZE-PROPERTY:ERROR': '{message}',
                    'TOURNAMENT-LAYOUT-ALREADY-EXISTS:ERROR': '{message}',
                },
                successCode: 'TOURNAMENT-LAYOUTS-CREATED:SUCCESS',
                extraData: {},
            };
            this.handlerController(container, 'CreateTournamentLayoutUsecase', response, config, undefined, body);
        });
        app.patch(`/tournament-layout`, (request, response) => {
            const body = Object.assign({}, request.body);
            console.log('Lo que llego a la petición', body);
            const config = {
                exceptions: {
                    TournamentLayoutDoesNotExistsError: 'TOURNAMENT-LAYOUT-DOES-NOT-EXISTS:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'TOURNAMENT-LAYOUT-DOES-NOT-EXISTS:ERROR': '{message}',
                },
                successCode: 'TOURNAMENT-LAYOUT-EDITED:SUCCESS',
                extraData: {},
            };
            this.handlerController(container, 'EditTournamentLayoutUsecase', response, config, undefined, body);
        });
    }
}
exports.OrganizationController = OrganizationController;
OrganizationController.identifier = 'ORGANIZATION';
