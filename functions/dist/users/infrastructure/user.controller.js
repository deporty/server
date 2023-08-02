"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const controller_1 = require("../../core/controller/controller");
class UserController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/ready`, controller_1.readyHandler);
        app.get(`/email/:email`, (request, response) => {
            const email = request.params.email;
            const config = {
                exceptions: {
                    UserDoesNotExistException: 'GET-BY-EMAIL:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-EMAIL:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET-BY-EMAIL:SUCCESS',
                    message: 'The user was founded',
                },
                extraData: {
                    entitiesName: 'team',
                },
            };
            this.handlerController(container, 'GetUserInformationByEmailUsecase', response, config, undefined, email);
        });
        app.get(`/fullname`, (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {
                    UserDoesNotExistException: 'GET-BY-FULLNAME:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-FULLNAME:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET-BY-FULLNAME:SUCCESS',
                    message: 'The user was founded',
                },
            };
            this.handlerController(container, 'GetUserInformationByFullNameUsecase', response, config, undefined, params);
        });
        app.get(`/filters`, (request, response) => {
            const query = Object.assign(Object.assign({}, request.query), { roles: [request.query.roles] });
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                extraData: {
                    entitiesName: 'users',
                },
                successCode: 'GET:SUCCESS',
            };
            this.handlerController(container, 'GetUsersByFiltersUsecase', response, config, undefined, query);
        });
        app.get(`/ids`, (request, response) => {
            const ids = request.query.ids;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: 'GET-BY-IDS:SUCCESS',
                    message: 'The users were found.',
                },
            };
            this.handlerController(container, 'GetUsersByIdsUsecase', response, config, undefined, ids);
        });
        app.get(`/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    UserDoesNotExistException: 'GET-BY-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET-BY-ID:SUCCESS',
                    message: 'The user was founded',
                },
            };
            this.handlerController(container, 'GetUserByIdUsecase', response, config, undefined, id);
        });
        app.get(`/`, (request, response) => {
            const query = request.query;
            const params = {
                pageSize: parseInt(query.pageSize),
                pageNumber: parseInt(query.pageNumber),
                rol: query.rol,
            };
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                extraData: {
                    entitiesName: 'users',
                },
                successCode: 'GET:SUCCESS',
            };
            this.handlerController(container, 'GetUsersByRolUsecase', response, config, undefined, params);
        });
        app.put(`/assign-roles`, (request, response) => {
            const params = request.body;
            const config = {
                exceptions: {
                    UserDoesNotExistException: 'ASSIGN-ROLES:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'ASSIGN-ROLES:ERROR': '{message}',
                },
                successCode: {
                    code: 'ASSIGN-ROLES:SUCCESS',
                    message: 'The roles were updated.',
                },
            };
            this.handlerController(container, 'AsignRolesToUserUsecase', response, config, undefined, params);
        });
    }
}
exports.UserController = UserController;
UserController.identifier = 'USER';
