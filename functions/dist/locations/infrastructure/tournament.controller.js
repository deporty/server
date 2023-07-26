"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentController = void 0;
const controller_1 = require("../../core/controller/controller");
class TournamentController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/ready`, controller_1.readyHandler);
        app.get(`/`, (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: 'GET:SUCCESS',
                extraData: {},
            };
            this.handlerController(container, 'GetLocationsUsecase', response, config, undefined, params);
        });
    }
}
exports.TournamentController = TournamentController;
TournamentController.identifier = 'LOCATION';
