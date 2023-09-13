import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Request, Response, Router } from 'express';
import { AsignRolesToUserUsecase } from '../domain/usecases/asign-roles-to-user/asign-roles-to-user.usecase';
import { GetTeamsThatIBelongUsecase } from '../domain/usecases/get-teams-that-i-belong/get-teams-that-i-belong.usecase';
import { GetUsersByFiltersUsecase } from '../domain/usecases/get-user-by-filters/get-user-by-filters.usecase';
import { GetUserByIdUsecase, UserDoesNotExistByIdError } from '../domain/usecases/get-user-by-id/get-user-by-id.usecase';
import {
  GetUserInformationByEmailUsecase,
  UserDoesNotExistError,
} from '../domain/usecases/get-user-information-by-email/get-user-information-by-email.usecase';
import {
  GetUserInformationByFullNameUsecase,
  UserDoesNotExistByFullNameError,
} from '../domain/usecases/get-user-information-by-full-name/get-user-information-by-full-name.usecase';
import { GetUsersByIdsUsecase } from '../domain/usecases/get-users-by-ids/get-users-by-ids.usecase';
import { GetUsersByRolUsecase } from '../domain/usecases/get-users-by-rol/get-users-by-rol.usecase';
import { SERVER_NAME } from './users.constants';

export class UserController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/ready`, this.readyHandler as any);

    router.get(`/email/:email`, (request: Request, response: Response) => {
      const email = request.params.email;

      const config: MessagesConfiguration = {
        exceptions: {
          [UserDoesNotExistError.id]: 'GET-BY-EMAIL:ERROR',
        },
        identifier: this.identifier,
        successCode: {
          code: 'GET-BY-EMAIL:SUCCESS',
          message: 'The user was founded',
        },
      };

      this.handler<GetUserInformationByEmailUsecase>({
        container,
        usecaseId: 'GetUserInformationByEmailUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: email,
      });
    });

    router.get(`/teams-that-i-belong/:email`, (request: Request, response: Response) => {
      const email = request.params.email;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TEAMS-THAT-I-BELONG:SUCCESS',
      };

      this.handler<GetTeamsThatIBelongUsecase>({
        container,
        usecaseId: 'GetTeamsThatIBelongUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: email,
      });
    });

    router.get(`/fullname`, (request: Request, response: Response) => {
      const params = request.query;
      const config: MessagesConfiguration = {
        exceptions: {
          [UserDoesNotExistByFullNameError.id]: 'GET-BY-FULLNAME:ERROR',
        },
        identifier: this.identifier,

        successCode: {
          code: 'GET-BY-FULLNAME:SUCCESS',
          message: 'The user was founded',
        },
      };

      this.handler<GetUserInformationByFullNameUsecase>({
        container,
        usecaseId: 'GetUserInformationByFullNameUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/filters`, (request: Request, response: Response) => {
      const query: any = { ...request.query, roles: [request.query.roles] };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        extraData: {
          entitiesName: 'users',
        },
        successCode: 'GET:SUCCESS',
      };

      this.handler<GetUsersByFiltersUsecase>({
        container,
        usecaseId: 'GetUsersByFiltersUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: query,
      });
    });

    router.get(`/ids`, (request: Request, response: Response) => {
      const ids = request.query.ids;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-BY-IDS:SUCCESS',
          message: 'The users were found.',
        },
      };

      this.handler<GetUsersByIdsUsecase>({
        container,
        usecaseId: 'GetUsersByIdsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: ids,
      });
    });
    router.get(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: MessagesConfiguration = {
        exceptions: {
          [UserDoesNotExistByIdError.id]: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        successCode: {
          code: 'GET-BY-ID:SUCCESS',
          message: 'The user was founded',
        },
      };

      this.handler<GetUserByIdUsecase>({
        container,
        usecaseId: 'GetUserByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });

    router.get(`/`, (request: Request, response: Response) => {
      const query: any = request.query;
      const params = {
        pageSize: parseInt(query.pageSize),
        pageNumber: parseInt(query.pageNumber),
        rol: query.rol,
      };
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        extraData: {
          entitiesName: 'users',
        },
        successCode: 'GET:SUCCESS',
      };

      this.handler<GetUsersByRolUsecase>({
        container,
        usecaseId: 'GetUsersByRolUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.put(`/assign-roles`, (request: Request, response: Response) => {
      const params = request.body;

      const config: MessagesConfiguration = {
        exceptions: {
          [UserDoesNotExistByIdError.id]: 'ASSIGN-ROLES:ERROR',
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

      this.handler<AsignRolesToUserUsecase>({
        container,
        usecaseId: 'AsignRolesToUserUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
  }
}
