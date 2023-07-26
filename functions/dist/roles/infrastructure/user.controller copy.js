"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const controller_1 = require("../../core/controller/controller");
class UserController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/email/:email`, (request, response) => {
            const email = request.params.email;
            console.log(email);
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
        app.get(`/:id`, (request, response) => {
            const id = request.params.id;
            console.log(id);
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
            this.handlerController(container, 'GetUserInformationByIdUsecase', response, config, undefined, id);
        });
    }
}
exports.UserController = UserController;
UserController.identifier = 'USER';
