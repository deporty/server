"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const controller_1 = require("../../core/controller/controller");
class PlayerController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.delete(`/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    VariableNotDefinedException: 'DELETE:ERROR',
                    PlayerDoesNotExistException: 'DELETE:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'DELETE:ERROR': '{message}',
                },
                successCode: 'DELETE:SUCCESS',
                extraData: {
                    entitiesName: 'player',
                },
            };
            this.handlerController(container, 'DeletePlayerUsecase', response, config, undefined, id);
        });
        app.get(`/`, (request, response) => {
            const config = {
                exceptions: {
                    PlayerAlreadyExistsException: 'GET:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ERROR': '{message}',
                },
                successCode: 'GET:SUCCESS',
                extraData: {
                    entitiesName: 'players',
                },
            };
            this.handlerController(container, 'GetPlayersUsecase', response, config);
        });
        app.get(`/:id`, (request, response) => {
            const id = request.params.id;
            const config = {
                exceptions: {
                    PlayerDoesNotExistException: 'GET:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ERROR': '{message}',
                },
                successCode: {
                    code: 'GET:SUCCESS',
                    message: 'Player founded successfully',
                },
                extraData: {
                    entitiesName: 'players',
                },
            };
            this.handlerController(container, 'GetPlayerByIdUsecase', response, config, undefined, id);
        });
        app.get(`/document/:document`, (request, response) => {
            const document = request.params.document;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: {
                    code: 'GET:DOCUMENT:SUCCESS',
                    message: 'Information for player with document {document}',
                },
                extraData: {
                    document,
                },
            };
            this.handlerController(container, 'GetPlayerByDocumentUsecase', response, config, undefined, document);
        });
        app.post(`/`, (request, response) => {
            const player = request.body;
            const config = {
                exceptions: {
                    PlayerAlreadyExistsException: 'POST:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'POST:ERROR': '{message}',
                },
                successCode: {
                    name: 'POST:SUCCESS',
                    message: 'Player saved successfully',
                },
                extraData: {
                    entitiesName: 'player',
                },
            };
            this.handlerPostController(container, 'CreatePlayerUsecase', response, config, 'PlayerMapper', player);
        });
    }
}
exports.PlayerController = PlayerController;
PlayerController.identifier = 'PLAYER';
