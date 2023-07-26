"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesController = void 0;
const controller_1 = require("../../core/controller/controller");
class InvoicesController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.put(`/tournament`, (request, response) => {
            const document = request.body;
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
            this.handlerController(container, 'CalculateTournamentInvoicesByOrganizerAndTournament', response, config, undefined, document);
        });
    }
}
exports.InvoicesController = InvoicesController;
InvoicesController.identifier = 'INVOICES';
