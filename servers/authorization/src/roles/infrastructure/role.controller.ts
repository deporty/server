import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Request, Response, Router } from 'express';
import { SERVER_NAME } from '../../infrastructure/authorization.constants';
import { GetRoleByIdUsecase, RoleDoesNotExistError } from '../domain/usecases/get-role-by-id.usecase';

export class RoleController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/role/:id`, (request: Request, response: Response) => {
      const id = request.params.id;
      const config: MessagesConfiguration = {
        exceptions: {
          [RoleDoesNotExistError.id]: 'GET-BY-ID:ERROR',
        },
        identifier: this.identifier,
        successCode: {
          code: 'GET-ROLE-BY-ID:SUCCESS',
          message: 'The role was founded',
        },
      };
      this.handler<GetRoleByIdUsecase>({
        container,
        usecaseId: 'GetRoleByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
  }
}
