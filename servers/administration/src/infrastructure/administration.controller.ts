import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Router, Request, Response } from 'express';
import { GetCurrentMobileVersionUsecase } from '../domain/usecases/get-current-mobile-version/get-current-mobile-version.usecase';
import { SERVER_NAME } from './administration.constants';
import { GetCurrentMobileVersionsUsecase } from '../domain/usecases/get-current-mobile-versions/get-current-mobile-versions.usecase';

export class AdministrationController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/ready`, this.readyHandler as any);

    router.get(`/mobile-version/current`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        successCode: 'GET-CURRENT-MOBILE-VERSION:SUCCESS',
      };

      this.handler<GetCurrentMobileVersionUsecase>({
        container,
        usecaseId: 'GetCurrentMobileVersionUsecase',
        response,
        messageConfiguration: config,
      });
    });
    router.get(`/mobile-version/currents`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        successCode: 'GET-CURRENT-MOBILE-VERSION:SUCCESS',
      };

      this.handler<GetCurrentMobileVersionsUsecase>({
        container,
        usecaseId: 'GetCurrentMobileVersionsUsecase',
        response,
        messageConfiguration: config,
      });
    });
  }
}
