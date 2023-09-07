import { Express, Request, Response } from 'express';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { GetRoleByIdUsecase, RoleDoesNotExistError } from '../domain/usecases/get-role-by-id.usecase';
import { SERVER_NAME } from '../../infrastructure/authorization.constants';

export class RoleController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/role/:id`, (request: Request, response: Response) => {
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
