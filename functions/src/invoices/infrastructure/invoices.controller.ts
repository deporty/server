import { Express } from 'express';
import {
  BaseController, readyHandler
} from '../../core/controller/controller';
import { Container } from '../../core/DI';
// import { GetTournamentsInvoiceByOrganizerUsecase } from '../usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';

export class InvoicesController extends BaseController {
  static identifier = 'INVOICES';

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/ready`, readyHandler as any);

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
