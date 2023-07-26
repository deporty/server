"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const controller_1 = require("../../core/controller/controller");
class LocationController extends controller_1.BaseController {
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
            this.handlerController(container, 'GetLocationsUsecase', response, config, undefined, {
                pageSize: parseInt(params.pageSize),
                pageNumber: parseInt(params.pageNumber),
            });
        });
        app.get(`/ids`, (request, response) => {
            var _a;
            const params = request.query;
            const ids = (_a = params.ids) === null || _a === void 0 ? void 0 : _a.split(',').map((x) => x.trim());
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: 'GET:SUCCESS',
                extraData: {
                    entitiesName: 'locations',
                },
            };
            this.handlerController(container, 'GetLocationsByIdsUsecase', response, config, undefined, ids);
        });
        app.get(`/ratio`, (request, response) => {
            const params = request.query;
            const config = {
                exceptions: {},
                identifier: this.identifier,
                errorCodes: {},
                successCode: 'GET:SUCCESS',
                extraData: {
                    entitiesName: 'locations',
                },
            };
            this.handlerController(container, 'GetLocationsByRatioUsecase', response, config, undefined, {
                origin: {
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude),
                },
                ratio: parseFloat(params.ratio),
            });
        });
        app.get(`/:id`, (request, response) => {
            const params = request.params;
            const id = params.id;
            const config = {
                exceptions: {
                    LocationDoesNotExistError: 'GET:ERROR',
                },
                identifier: this.identifier,
                errorCodes: {
                    'GET:ERROR': '{message}',
                },
                successCode: 'GET:SUCCESS',
                extraData: {},
            };
            this.handlerController(container, 'GetLocationByIdUsecase', response, config, undefined, id);
        });
    }
}
exports.LocationController = LocationController;
LocationController.identifier = 'LOCATION';
