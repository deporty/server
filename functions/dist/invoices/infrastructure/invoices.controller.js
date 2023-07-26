"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesController = void 0;
const controller_1 = require("../../core/controller/controller");
// import { GetTournamentsInvoiceByOrganizerUsecase } from '../usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';
class InvoicesController extends controller_1.BaseController {
    constructor() {
        super();
    }
    static registerEntryPoints(app, container) {
        app.get(`/ready`, controller_1.readyHandler);
        // app.get(`/:organizationId`, (request: Request, response: Response) => {
        //   const document = request.params.organizationId;
        //   const config: IMessagesConfiguration = {
        //     exceptions: {},
        //     identifier: this.identifier,
        //     errorCodes: {},
        //     successCode: {
        //       code: 'GET:DOCUMENT:SUCCESS',
        //       message: 'Information for player with document {document}',
        //     },
        //     extraData: {
        //       document,
        //     },
        //   };
        //   this.handlerController<GetTournamentsInvoiceByOrganizerUsecase, any>(
        //     container,
        //     'GetTournamentsInvoiceByOrganizerUsecase',
        //     response,
        //     config,
        //     undefined,
        //     document
        //   );
        // });
    }
}
exports.InvoicesController = InvoicesController;
InvoicesController.identifier = 'INVOICES';
