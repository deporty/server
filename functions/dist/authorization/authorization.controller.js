"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationController = void 0;
const controller_1 = require("../core/controller/controller");
class AuthorizationController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/access-key/:accessKey`, (request, response) => {
            const accessKey = request.params.accessKey;
            const config = {
                exceptions: {
                    RoleDoesNotExistException: 'GET-BY-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'VALID-ACCESS-KEY:SUCCESS',
                    message: 'The role was founded',
                },
            };
            this.handlerController(container, 'IsAValidAccessKeyUsecase', response, config, undefined, accessKey);
        });
        app.get(`/role/get-resources`, (request, response) => {
            let roles = request.query.roles;
            if (!Array.isArray(roles)) {
                roles = [roles];
            }
            const config = {
                exceptions: {
                    RoleDoesNotExistException: 'GET-BY-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'VALID-ACCESS-KEY:SUCCESS',
                    message: 'The role was founded',
                },
            };
            this.handlerController(container, 'GetAllowedResourcesByRoleIdsUsecase', response, config, undefined, roles);
        });
        app.get(`/get-token/:email`, (request, response) => {
            let email = request.params.email;
            const config = {
                exceptions: {
                    RoleDoesNotExistException: 'GET-BY-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'VALID-ACCESS-KEY:SUCCESS',
                    message: 'The role was founded',
                },
            };
            this.handlerController(container, 'GetTokenUsecase', response, config, undefined, email);
        });
        app.get(`/role/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    RoleDoesNotExistException: 'GET-BY-ID:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET-BY-ID:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET-ROLE-BY-ID:SUCCESS',
                    message: 'The role was founded',
                },
            };
            this.handlerController(container, 'GetRoleByIdUsecase', response, config, undefined, id);
        });
    }
}
exports.AuthorizationController = AuthorizationController;
AuthorizationController.identifier = 'AUTHORIZATION';
