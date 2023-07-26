"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const controller_1 = require("../../core/controller/controller");
class RoleController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/:id`, (request, response) => {
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
                    code: 'GET-BY-ID:SUCCESS',
                    message: 'The role was founded',
                },
            };
            this.handlerController(container, 'GetRoleByIdUsecase', response, config, undefined, id);
        });
    }
}
exports.RoleController = RoleController;
RoleController.identifier = 'ROLE';
