import { Express, Request, Response } from 'express';
import { Container } from '../../core/DI';
import {
  BaseController,
  IMessagesConfiguration,
  readyHandler,
} from '../../core/controller/controller';
import { AsignRolesToUserUsecase } from '../domain/usecases/asign-roles-to-user/asign-roles-to-user.usecase';
import { GetUserInformationByEmailUsecase } from '../domain/usecases/get-user-information-by-email/get-user-information-by-email.usecase';
import { GetUserInformationByFullNameUsecase } from '../domain/usecases/get-user-information-by-full-name/get-user-information-by-full-name.usecase';
import { GetUserInformationByIdUsecase } from '../domain/usecases/get-user-information-by-id.usecase';
import { GetUsersByFiltersUsecase } from '../domain/usecases/get-user-by-filters/get-user-by-filters.usecase';
import { GetUsersByRolUsecase } from '../domain/usecases/get-users-by-rol/get-users-by-rol.usecase';

export class UserController extends BaseController {
  constructor() {
    super();
  }

  static identifier = 'USER';

  static registerEntryPoints(app: Express, container: Container) {

    app.get(`/ready`, readyHandler as any);

    
    app.get(`/email/:email`, (request: Request, response: Response) => {
      const email = request.params.email;

      const config: IMessagesConfiguration = {
        exceptions: {
          UserDoesNotExistException: 'GET-BY-EMAIL:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-EMAIL:ERROR': '{message}',
        },
        successCode: {
          code: 'GET-BY-EMAIL:SUCCESS',
          message: 'The user was founded',
        },
        extraData: {
          entitiesName: 'team',
        },
      };

      this.handlerController<GetUserInformationByEmailUsecase, any>(
        container,
        'GetUserInformationByEmailUsecase',
        response,
        config,
        undefined,
        email
      );
    });

    app.get(`/fullname`, (request: Request, response: Response) => {
      const params = request.query;
      const config: IMessagesConfiguration = {
        exceptions: {
          UserDoesNotExistException: 'GET-BY-FULLNAME:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-FULLNAME:ERROR': '{message}',
        },
        successCode: {
          code: 'GET-BY-FULLNAME:SUCCESS',
          message: 'The user was founded',
        },
      };

      this.handlerController<GetUserInformationByFullNameUsecase, any>(
        container,
        'GetUserInformationByFullNameUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.get(`/filters`, (request: Request, response: Response) => {
      const query: any = { ...request.query, roles: [request.query.roles] };

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        extraData: {
          entitiesName: 'users',
        },
        successCode: 'GET:SUCCESS',
      };

      this.handlerController<GetUsersByFiltersUsecase, any>(
        container,
        'GetUsersByFiltersUsecase',
        response,
        config,
        undefined,
        query
      );
    });

    app.get(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          UserDoesNotExistException: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-ID:ERROR': '{message}',
        },
        successCode: {
          code: 'GET-BY-ID:SUCCESS',
          message: 'The user was founded',
        },
      };

      this.handlerController<GetUserInformationByIdUsecase, any>(
        container,
        'GetUserInformationByIdUsecase',
        response,
        config,
        undefined,
        id
      );
    });
    app.get(`/`, (request: Request, response: Response) => {
      const query: any = request.query;
      const params = {
        pageSize: parseInt(query.pageSize),
        pageNumber: parseInt(query.pageNumber),
        rol: query.rol,
      };
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        extraData: {
          entitiesName: 'users',
        },
        successCode: 'GET:SUCCESS',
      };

      this.handlerController<GetUsersByRolUsecase, any>(
        container,
        'GetUsersByRolUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.put(`/assign-roles`, (request: Request, response: Response) => {
      const params = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {
          UserDoesNotExistException: 'ASSIGN-ROLES:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'ASSIGN-ROLES:ERROR': '{message}',
        },
        successCode: {
          code: 'ASSIGN-ROLES:SUCCESS',
          message: 'The roles were updated.',
        },
      };

      this.handlerController<AsignRolesToUserUsecase, any>(
        container,
        'AsignRolesToUserUsecase',
        response,
        config,
        undefined,
        params
      );
    });
  }
}
