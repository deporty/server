import { Request, Response, Router } from 'express';

import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { SERVER_NAME } from '../../infrastructure/authorization.constants';
import { GetAllowedResourcesByRoleIdsUsecase } from '../domain/usecases/get-allowed-resources-by-role-ids/get-allowed-resources-by-role-ids.usecase';
import { ResourceDoesNotExistError } from '../domain/usecases/get-resource-by-id.usecase';
import { GetResourcesUsecase } from '../domain/usecases/get-resources.usecase';

export class ResourceController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/role/get-resources`, (request: Request, response: Response) => {
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
    router.get(`/resources`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GOTTEN-RESOURCES:SUCCESS',
      };

      this.handler<GetResourcesUsecase>({
        container,
        usecaseId: 'GetResourcesUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: void 0,
      });
    });
  }
}
