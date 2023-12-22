import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Request, Response, Router } from 'express';
import { SERVER_NAME } from '../../infrastructure/authorization.constants';
import { GetPermissionsUsecase } from '../domain/usecases/get-permissions/get-permissions.usecase';

export class PermissionController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/permissions`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-PERMISSIONS:SUCCESS',
      };
      this.handler<GetPermissionsUsecase>({
        container,
        usecaseId: 'GetPermissionsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: void 0,
      });
    });
  }
}
