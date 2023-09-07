import { Express, Request, Response } from 'express';

import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { GetAllowedResourcesByRoleIdsUsecase } from '../domain/usecases/get-allowed-resources-by-role-ids/get-allowed-resources-by-role-ids.usecase';
import { SERVER_NAME } from '../../infrastructure/authorization.constants';
import { ResourceDoesNotExistError } from '../domain/usecases/get-resource-by-id.usecase';

export class ResourceController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/role/get-resources`, (request: Request, response: Response) => {
      let roles: any = request.query.roles;
      if (!Array.isArray(roles)) {
        roles = [roles];
      }
      const config: MessagesConfiguration = {
        exceptions: {
          [ResourceDoesNotExistError.id]: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        successCode: {
          code: 'VALID-ACCESS-KEY:SUCCESS',
          message: 'The role was founded',
        },
      };

      this.handler<GetAllowedResourcesByRoleIdsUsecase>({
        container,
        usecaseId: 'GetAllowedResourcesByRoleIdsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: roles,
      });
    });
  }
}
