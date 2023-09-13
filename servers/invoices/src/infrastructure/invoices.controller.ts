import { Router } from 'express';

import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController } from '@scifamek-open-source/iraca/web-api';
import { SERVER_NAME } from './invoices.constants';
// import { GetTournamentsInvoiceByOrganizerUsecase } from '../usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';

export class InvoicesController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/ready`, this.readyHandler as any);

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
