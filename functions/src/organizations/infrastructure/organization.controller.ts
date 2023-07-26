import { Express, Request, Response } from 'express';
import {
  BaseController,
  IMessagesConfiguration,
  readyHandler,
} from '../../core/controller/controller';
import { Container } from '../../core/DI';
import { GetOrganizationWhereExistsMemberEmailUsecase } from '../domain/usecases/get-organization-where-exists-member-email.usecase';
import { GetOrganizationWhereExistsMemberIdUsecase } from '../domain/usecases/get-organization-where-exists-member-id.usecase';
import { GetOrganizationsUsecase } from '../domain/usecases/get-organizations/get-organizations.usecase';
import { GetTournamentLayoutsByOrganizationIdUsecase } from '../domain/usecases/get-tournament-layouts-by-organization-id/get-tournament-layouts-by-organization-id.usecase';
import { CreateTournamentLayoutUsecase } from '../domain/usecases/create-tournament-layout/create-tournament-layout.usecase';
import { GetOrganizationByIdUsecase } from '../domain/usecases/get-organization-by-id/get-organization-by-id.usecase';
import { GetTournamentLayoutByIdUsecase } from '../domain/usecases/get-tournament-layout-by-id/get-tournament-layout-by-id.usecase';
import { EditTournamentLayoutUsecase } from '../domain/usecases/edit-tournament-layout/edit-tournament-layout.usecase';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';

export class OrganizationController extends BaseController {
  constructor() {
    super();
  }

  static identifier = 'ORGANIZATION';

  static registerEntryPoints(app: Express, container: Container) {
    app.get(`/ready`, readyHandler as any);

    app.get(`/`, (request: Request, response: Response) => {
      const params = request.query;
      const config: IMessagesConfiguration = {
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

      this.handlerController<GetOrganizationsUsecase, any>(
        container,
        'GetOrganizationsUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.get(`/member/:id`, (request: Request, response: Response) => {
      const memberId = request.params.id;
      const config: IMessagesConfiguration = {
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

      this.handlerController<GetOrganizationWhereExistsMemberIdUsecase, any>(
        container,
        'GetOrganizationWhereExistsMemberIdUsecase',
        response,
        config,
        undefined,
        memberId
      );
    });

    app.get(`/member/email/:email`, (request: Request, response: Response) => {
      const email = request.params.email;
      const config: IMessagesConfiguration = {
        exceptions: {
          VariableNotDefinedException: 'GET-BY-MEMBER-EMAIL:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET-BY-MEMBER-EMAIL:ERROR': '{message}',
        },
        successCode: 'GET-BY-MEMBER-EMAIL:SUCCESS',
      };

      this.handlerController<GetOrganizationWhereExistsMemberEmailUsecase, any>(
        container,
        'GetOrganizationWhereExistsMemberEmailUsecase',
        response,
        config,
        undefined,
        email
      );
    });
    app.get(
      `/:organizationId/tournament-layouts`,
      (request: Request, response: Response) => {
        const organizationId = request.params.organizationId;

        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: 'GET-TOURNAMENT-LAYOUTS:SUCCESS',
        };

        this.handlerController<
          GetTournamentLayoutsByOrganizationIdUsecase,
          any
        >(
          container,
          'GetTournamentLayoutsByOrganizationIdUsecase',
          response,
          config,
          undefined,
          organizationId
        );
      }
    );
    app.get(`/:organizationId`, (request: Request, response: Response) => {
      const organizationId = request.params.organizationId;

      const config: IMessagesConfiguration = {
        exceptions: {
          OrganizationNotFoundError: 'DOES-NOT-EXIST:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'DOES-NOT-EXIST:ERROR': '{message}',
        },
        successCode: 'GET-BY-ID:SUCCESS',
      };

      this.handlerController<GetOrganizationByIdUsecase, any>(
        container,
        'GetOrganizationByIdUsecase',
        response,
        config,
        undefined,
        organizationId
      );
    });

    app.get(
      `/:organizationId/tournament-layout/:tournamentLayoutId`,
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            TournamentLayoutNotFoundError: 'DOES-NOT-EXIST:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'DOES-NOT-EXIST:ERROR': '{message}',
          },
          successCode: 'GET-TOURNAMENT-LAYOUT-BY-ID:SUCCESS',
        };

        this.handlerController<GetTournamentLayoutByIdUsecase, any>(
          container,
          'GetTournamentLayoutByIdUsecase',
          response,
          config,
          undefined,
          params
        );
      }
    );
    app.post(`/tournament-layout`, (request: Request, response: Response) => {
      const body = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {
          Base64Error: 'IMAGE:ERROR',
          SizeError: 'IMAGE:ERROR',
          SizePropertyError: 'IMAGE-SIZE-PROPERTY:ERROR',
          TournamentLayoutAlreadyExistsError:
            'TOURNAMENT-LAYOUT-ALREADY-EXISTS:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'IMAGE:ERROR': '{message}',
          'IMAGE-SIZE-PROPERTY:ERROR': '{message}',
          'TOURNAMENT-LAYOUT-ALREADY-EXISTS:ERROR': '{message}',
        },
        successCode: 'TOURNAMENT-LAYOUTS-CREATED:SUCCESS',
        extraData: {},
      };

      this.handlerController<CreateTournamentLayoutUsecase, any>(
        container,
        'CreateTournamentLayoutUsecase',
        response,
        config,
        undefined,
        body
      );
    });
    app.patch(`/tournament-layout`, (request: Request, response: Response) => {
      const body: TournamentLayoutEntity = {
        ...request.body,
      };

      console.log('Lo que llego a la petición', body);

      const config: IMessagesConfiguration = {
        exceptions: {
          TournamentLayoutDoesNotExistsError:
            'TOURNAMENT-LAYOUT-DOES-NOT-EXISTS:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'TOURNAMENT-LAYOUT-DOES-NOT-EXISTS:ERROR': '{message}',
        },
        successCode: 'TOURNAMENT-LAYOUT-EDITED:SUCCESS',
        extraData: {},
      };

      this.handlerController<EditTournamentLayoutUsecase, any>(
        container,
        'EditTournamentLayoutUsecase',
        response,
        config,
        undefined,
        body
      );
    });
  }
}
