import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Router } from 'express';
import { AccessKeyController } from './access-key/infrastructure/access-key.controller';
import { SERVER_NAME } from './infrastructure/authorization.constants';
import { ResourceController } from './resources/infrastructure/resource.controller';
import { RoleController } from './roles/infrastructure/role.controller';

import { Request, Response } from 'express';
import { GetTokenUsecase } from './domain/usecases/get-token/get-token.usecase';

export class AuthorizationController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/ready`, this.readyHandler as any);

    router.get(`/get-token/:email`, (request: Request, response: Response) => {
      const email = request.params.email;
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-TOKEN:SUCCESS',
          message: 'The token was genrated',
        },
      };
      this.handler<GetTokenUsecase>({
        container,
        usecaseId: 'GetTokenUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: email,
      });
    });

    AccessKeyController.registerEntryPoints(router, container);
    ResourceController.registerEntryPoints(router, container);
    RoleController.registerEntryPoints(router, container);
  }
}
