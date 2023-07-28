import { TeamEntity } from '@deporty-org/entities/teams';
import { Request, Response, Router } from 'express';
import { Container } from '../../core/DI';
import {
  BaseController,
  IMessagesConfiguration,
  readyHandler,
} from '../../core/controller/controller';

import { IsAuthorizedUserMiddleware } from '../../core/middlewares/is-authorized-user.middleware';
import { DeleteTeamUsecase } from '../domain/usecases/delete-team/delete-team.usecase';
import { GetTeamsUsecase } from '../domain/usecases/get-teams/get-teams.usecase';
import { GetTeamByFiltersUsecase } from '../domain/usecases/get-teams-by-filters/get-teams-by-filters.usecase';
import { GetTeamByIdUsecase } from '../domain/usecases/get-team-by-id/get-team-by-id.usecase';
import { GetMembersByTeamUsecase } from '../domain/usecases/get-members-by-team/get-members-by-team.usecase';
import { GetMemberByIdUsecase } from '../domain/usecases/get-member-by-id/get-member-by-id.usecase';
import { GetSportByIdUsecase } from '../domain/usecases/get-sport-by-id/get-sport-by-id.usecase';
import { CreateTeamUsecase } from '../domain/usecases/create-team/create-team.usecase';
import { JWT_SECRET } from './teams.constants';
import { GetTeamByAdvancedFiltersUsecase } from '../domain/usecases/get-teams-by-advanced-filters/get-teams-by-advanced-filters.usecase';


export class TeamController extends BaseController {
  constructor() {
    super();
  }

  static identifier = 'TEAM';

  static registerEntryPoints(app: Router, container: Container) {
    const middleware: IsAuthorizedUserMiddleware =
      container.getInstance<IsAuthorizedUserMiddleware>(
        'IsAuthorizedUserMiddleware'
      ).instance;
    const validator = (i: string) => middleware.getValidator(i,JWT_SECRET);


    app.get(`/ready`, readyHandler as any);

    
    app.delete(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          VariableNotDefinedException: 'DELETE:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'DELETE:ERROR': '{message}',
        },
        successCode: 'DELETE:SUCCESS',
        extraData: {
          entitiesName: 'team',
        },
      };

      this.handlerController<DeleteTeamUsecase, any>(
        container,
        'DeleteTeamUsecase',
        response,
        config,
        undefined,
        id
      );
    });

    app.get(
      `/all`,
      validator('GetTeamsUsecase'),
      (request: Request, response: Response) => {
        const params = request.query;
        const config: IMessagesConfiguration = {
          exceptions: {
            TeamAlreadyExistsException: 'GET:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GET:ERROR': '{message}',
          },
          successCode: 'GET:SUCCESS',
          extraData: {
            entitiesName: 'teams',
          },
        };

        this.handlerController<GetTeamsUsecase, any>(
          container,
          'GetTeamsUsecase',
          response,
          config,
          undefined,
          params
        );
      }
    );
    app.get(`/filter`, (request: Request, response: Response) => {
      const params = request.query;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'teams',
        },
      };

      this.handlerController<GetTeamByFiltersUsecase, any>(
        container,
        'GetTeamByFiltersUsecase',
        response,
        config,
        undefined,
        params
      );
    });
    app.post(`/advanced-filter`, (request: Request, response: Response) => {
      const params = request.body;


      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'teams',
        },
      };

      this.handlerController<GetTeamByAdvancedFiltersUsecase, any>(
        container,
        'GetTeamByAdvancedFiltersUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.get(`/name/:name`, (request: Request, response: Response) => {
      const name = request.params.name;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET:NAME:SUCCESS',
          message: 'Information for team with name {name}',
        },
        extraData: {
          name,
        },
      };

      this.handlerController<GetTeamByIdUsecase, any>(
        container,
        'GetTeamByNameUsecase',
        response,
        config,
        undefined,
        name
      );
    });

    app.get(`/:id/members`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          TeamDoesNotExist: 'GET:ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET:ID:ERROR': '{message}',
        },
        successCode: {
          code: 'GET-MEMBERS-BY-TEAM-ID:SUCCESS',
          message: 'Information for team with id {id}',
        },
        extraData: {
          id: id,
        },
      };

      this.handlerController<GetMembersByTeamUsecase, any>(
        container,
        'GetMembersByTeamUsecase',
        response,
        config,
        undefined,
        id
      );
    });
    app.get(
      `/:teamId/member/:memberId`,
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            MemberDoesNotExistException: 'GET-MEMBER-BY-ID:ERROR',
            UserDoesNotExistException: 'GET-USER-BY-ID:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GET-MEMBER-BY-ID:ERROR': '{message}',
            'GET-USER-BY-ID:ERROR': '{message}',
          },
          successCode: 'GET-MEMBER-BY-ID:SUCCESS',
          extraData: {
            id: params,
          },
        };

        this.handlerController<GetMemberByIdUsecase, any>(
          container,
          'GetMemberByIdUsecase',
          response,
          config,
          undefined,
          params
        );
      }
    );

    app.get(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          TeamDoesNotExist: 'GET:ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET:ID:ERROR': '{message}',
        },
        successCode: {
          code: 'GET:ID:SUCCESS',
          message: 'Information for team with id {id}',
        },
        extraData: {
          id: id,
        },
      };

      this.handlerController<GetTeamByIdUsecase, any>(
        container,
        'GetTeamByIdUsecase',
        response,
        config,
        undefined,
        id
      );
    });
    app.get(`/sport/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {
          SportDoesNotExistError: 'GET-SPORT-ID:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'GET:ID:ERROR': '{message}',
        },
        successCode: 'GET-SPORT-ID:SUCCESS',
        extraData: {
          id: id,
        },
      };

      this.handlerController<GetSportByIdUsecase, any>(
        container,
        'GetSportByIdUsecase',
        response,
        config,
        undefined,
        id
      );
    });

    app.post(`/`, (request: Request, response: Response) => {
      const team = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {
          TeamAlreadyExistsException: 'POST:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'POST:ERROR': '{message}',
        },
        successCode: 'POST:SUCCESS',
        extraData: {
          entitiesName: 'Team',
        },
      };

      this.handlerPostController<CreateTeamUsecase, TeamEntity>(
        container,
        'CreateTeamUsecase',
        response,
        config,
        undefined,
        team
      );
    });

    // app.put(`/assign-player`, (request: Request, response: Response) => {
    //   const data = request.body;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {
    //       PlayerIsAlreadyInTeamException: 'PLAYER-ALREADY-EXISTS:ERROR',
    //     },
    //     identifier: this.identifier,
    //     errorCodes: {
    //       'PLAYER-ALREADY-EXISTS:ERROR': '{message}',
    //     },
    //     successCode: {
    //       code: 'PLAYER-ASSIGNED:SUCCESS',
    //       message: 'The player was assigned.',
    //     },
    //     extraData: {
    //       entitiesName: 'Team',
    //     },
    //   };

    //   this.handlerPostController<AsignPlayerToTeamUsecase, TeamEntity>(
    //     container,
    //     'AsignPlayerToTeamUsecase',
    //     response,
    //     config,
    //     undefined,
    //     data
    //   );
    // });

    // app.get(
    //   `/by-registered-team/:id`,
    //   (request: Request, response: Response) => {
    //     const id = request.params.id;

    //     const config: IMessagesConfiguration = {
    //       exceptions: {},
    //       identifier: this.identifier,
    //       errorCodes: {},
    //       successCode: 'BY-REGISTERED-TEAM:SUCCESS',
    //       extraData: {
    //         name: id,
    //       },
    //     };

    //     this.handlerController<
    //       GetActiveTournamentsByRegisteredTeamUsecase,
    //       any
    //     >(
    //       container,
    //       'GetActiveTournamentsByRegisteredTeamUsecase',
    //       response,
    //       config,
    //       undefined,
    //       id
    //     );
    //   }
    // );
  }
}
