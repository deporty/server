import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Request, Response, Router } from 'express';
import { SERVER_NAME } from '../../infrastructure/authorization.constants';
import { IsAValidAccessKeyUsecase } from '../domain/usecases/is-a-valid-access-key/is-a-valid-access-key.usecase';

export class AccessKeyController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/access-key/:accessKey`, (request: Request, response: Response) => {
      const accessKey = request.params.accessKey;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'VALID-ACCESS-KEY:SUCCESS',
          message: 'The role was founded',
        },
      };

      this.handler<IsAValidAccessKeyUsecase>({
        container,
        usecaseId: 'IsAValidAccessKeyUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: accessKey,
      });
    });
  }
}
