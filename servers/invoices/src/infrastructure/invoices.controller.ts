import { Express } from 'express';

import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { SERVER_NAME } from './invoices.constants';
import { HttpController } from '@scifamek-open-source/iraca/web-api';
// import { GetTournamentsInvoiceByOrganizerUsecase } from '../usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';

export class InvoicesController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/ready`, this.readyHandler as any);

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
