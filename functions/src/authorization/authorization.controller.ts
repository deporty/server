import { Express, Request, Response } from 'express';

import { GetRoleByIdUsecase } from './roles/domain/usecases/get-role-by-id.usecase';
import {
  BaseController,
  IMessagesConfiguration,
} from '../core/controller/controller';
import { Container } from '../core/DI';
import { IsAValidAccessKeyUsecase } from './access-key/domain/usecases/is-a-valid-access-key/is-a-valid-access-key.usecase';
import { GetAllowedResourcesByRoleIdsUsecase } from './domain/usecases/get-allowed-resources-by-role-ids/get-allowed-resources-by-role-ids.usecase';
import { GetTokenUsecase } from './domain/usecases/get-token/get-token.usecase';

export class AuthorizationController extends BaseController {
  constructor() {
    super();
  }

  static identifier = 'AUTHORIZATION';

  static registerEntryPoints(app: Express, container: Container) {
    app.get(
      `/access-key/:accessKey`,
      (request: Request, response: Response) => {
        const accessKey = request.params.accessKey;

        const config: IMessagesConfiguration = {
          exceptions: {
            RoleDoesNotExistException: 'GET-BY-ID:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GET-BY-ID:ERROR': '{message}',
          },
          successCode: {
            code: 'VALID-ACCESS-KEY:SUCCESS',
            message: 'The role was founded',
          },
        };

        this.handlerController<IsAValidAccessKeyUsecase, any>(
          container,
          'IsAValidAccessKeyUsecase',
          response,
          config,
          undefined,
          accessKey
        );
      }
    );
    app.get(`/role/get-resources`, (request: Request, response: Response) => {
      let roles: any = request.query.roles;
      if (!Array.isArray(roles)) {
        roles = [roles];
      }
      const config: IMessagesConfiguration = {
        exceptions: {
          RoleDoesNotExistException: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-ID:ERROR': '{message}',
        },
        successCode: {
          code: 'VALID-ACCESS-KEY:SUCCESS',
          message: 'The role was founded',
        },
      };

      this.handlerController<GetAllowedResourcesByRoleIdsUsecase, any>(
        container,
        'GetAllowedResourcesByRoleIdsUsecase',
        response,
        config,
        undefined,
        roles
      );
    });
    app.get(`/get-token/:email`, (request: Request, response: Response) => {
      let email: any = request.params.email;

      const config: IMessagesConfiguration = {
        exceptions: {
          RoleDoesNotExistException: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-ID:ERROR': '{message}',
        },
        successCode: {
          code: 'VALID-ACCESS-KEY:SUCCESS',
          message: 'The role was founded',
        },
      };

      this.handlerController<GetTokenUsecase, any>(
        container,
        'GetTokenUsecase',
        response,
        config,
        undefined,
        email
      );
    });

    app.get(`/role/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          RoleDoesNotExistException: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-ID:ERROR': '{message}',
        },
        successCode: {
          code: 'GET-ROLE-BY-ID:SUCCESS',
          message: 'The role was founded',
        },
      };

      this.handlerController<GetRoleByIdUsecase, any>(
        container,
        'GetRoleByIdUsecase',
        response,
        config,
        undefined,
        id
      );
    });
  }
}
