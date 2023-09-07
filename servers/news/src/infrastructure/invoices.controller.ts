import { Express } from 'express';
import { HttpController } from '@scifamek-open-source/iraca/web-api';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
// import { GetTournamentsInvoiceByOrganizerUsecase } from '../usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';

export class NewsController extends HttpController {
  static identifier = 'NEWS';

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
