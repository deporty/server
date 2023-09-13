import { Request, Response, Router } from 'express';

import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import {
  CreateTournamentLayoutUsecase,
  TournamentLayoutAlreadyExistsError,
} from '../domain/usecases/create-tournament-layout/create-tournament-layout.usecase';
import {
  EditTournamentLayoutUsecase,
  TournamentLayoutDoesNotExistsError,
} from '../domain/usecases/edit-tournament-layout/edit-tournament-layout.usecase';
import {
  GetOrganizationByIdUsecase,
  OrganizationNotFoundError,
} from '../domain/usecases/get-organization-by-id/get-organization-by-id.usecase';
import { GetOrganizationWhereExistsMemberEmailUsecase } from '../domain/usecases/get-organization-where-exists-member-email.usecase';
import { GetOrganizationWhereExistsMemberIdUsecase } from '../domain/usecases/get-organization-where-exists-member-id.usecase';
import { GetOrganizationsUsecase } from '../domain/usecases/get-organizations/get-organizations.usecase';
import {
  GetTournamentLayoutByIdUsecase,
  TournamentLayoutNotFoundError,
} from '../domain/usecases/get-tournament-layout-by-id/get-tournament-layout-by-id.usecase';
import { GetTournamentLayoutsByOrganizationIdUsecase } from '../domain/usecases/get-tournament-layouts-by-organization-id/get-tournament-layouts-by-organization-id.usecase';
import { SERVER_NAME } from './organizations.constants';

export class OrganizationController extends HttpController {
  constructor() {
    super();
  }

  static identifier = SERVER_NAME;

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/ready`, this.readyHandler as any);

    router.get(`/`, (request: Request, response: Response) => {
      const params = request.query;
      const config: MessagesConfiguration = {
        exceptions: {
          VariableNotDefinedException: 'GET:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET:ERROR': '{message}',
        },
        successCode: 'GET-BY-MEMBER:SUCCESS',
        extraData: {
          entitiesName: 'team',
        },
      };

      this.handler<GetOrganizationsUsecase>({
        container,
        usecaseId: 'GetOrganizationsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          pageNumber: parseInt(params.pageNumber as string),
          pageSize: parseInt(params.pageSize as string),
        },
      });
    });

    router.get(`/member/:id`, (request: Request, response: Response) => {
      const memberId = request.params.id;
      const config: MessagesConfiguration = {
        exceptions: {
          VariableNotDefinedException: 'GET:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET:ERROR': '{message}',
        },
        successCode: 'GET-BY-MEMBER:SUCCESS',
        extraData: {
          entitiesName: 'team',
        },
      };

      this.handler<GetOrganizationWhereExistsMemberIdUsecase>({
        container,
        usecaseId: 'GetOrganizationWhereExistsMemberIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: memberId,
      });
    });

    router.get(`/member/email/:email`, (request: Request, response: Response) => {
      const email = request.params.email;
      const config: MessagesConfiguration = {
        exceptions: {
          VariableNotDefinedException: 'GET-BY-MEMBER-EMAIL:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-MEMBER-EMAIL:ERROR': '{message}',
        },
        successCode: 'GET-BY-MEMBER-EMAIL:SUCCESS',
      };

      this.handler<GetOrganizationWhereExistsMemberEmailUsecase>({
        container,
        usecaseId: 'GetOrganizationWhereExistsMemberEmailUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: email,
      });
    });
    router.get(`/:organizationId/tournament-layouts`, (request: Request, response: Response) => {
      const organizationId = request.params.organizationId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-TOURNAMENT-LAYOUTS:SUCCESS',
      };

      this.handler<GetTournamentLayoutsByOrganizationIdUsecase>({
        container,
        usecaseId: 'GetTournamentLayoutsByOrganizationIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: organizationId,
      });
    });
    router.get(`/:organizationId`, (request: Request, response: Response) => {
      const organizationId = request.params.organizationId;

      const config: MessagesConfiguration = {
        exceptions: {
          [OrganizationNotFoundError.id]: 'DOES-NOT-EXIST:ERROR',
        },
        identifier: this.identifier,
        successCode: 'GET-BY-ID:SUCCESS',
      };

      this.handler<GetOrganizationByIdUsecase>({
        container,
        usecaseId: 'GetOrganizationByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: organizationId,
      });
    });

    router.get(`/:organizationId/tournament-layout/:tournamentLayoutId`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        exceptions: {
          [TournamentLayoutNotFoundError.id]: 'DOES-NOT-EXIST:ERROR',
        },
        identifier: this.identifier,
        successCode: 'GET-TOURNAMENT-LAYOUT-BY-ID:SUCCESS',
      };

      this.handler<GetTournamentLayoutByIdUsecase>({
        container,
        usecaseId: 'GetTournamentLayoutByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.post(`/tournament-layout`, (request: Request, response: Response) => {
      const body = request.body;

      const config: MessagesConfiguration = {
        exceptions: {
          Base64Error: 'IMAGE:ERROR',
          SizeError: 'IMAGE:ERROR',
          SizePropertyError: 'IMAGE-SIZE-PROPERTY:ERROR',
          [TournamentLayoutAlreadyExistsError.id]: 'TOURNAMENT-LAYOUT-ALREADY-EXISTS:ERROR',
        },
        identifier: this.identifier,

        successCode: 'TOURNAMENT-LAYOUTS-CREATED:SUCCESS',
        extraData: {},
      };

      this.handler<CreateTournamentLayoutUsecase>({
        container,
        usecaseId: 'CreateTournamentLayoutUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
    router.patch(`/tournament-layout`, (request: Request, response: Response) => {
      const body: TournamentLayoutEntity = {
        ...request.body,
      };

      const config: MessagesConfiguration = {
        exceptions: {
          [TournamentLayoutDoesNotExistsError.id]: 'TOURNAMENT-LAYOUT-DOES-NOT-EXISTS:ERROR',
        },
        identifier: this.identifier,

        successCode: 'TOURNAMENT-LAYOUT-EDITED:SUCCESS',
        extraData: {},
      };

      this.handler<EditTournamentLayoutUsecase>({
        container,
        usecaseId: 'EditTournamentLayoutUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
  }
}
