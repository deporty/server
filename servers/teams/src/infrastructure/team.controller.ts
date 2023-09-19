import { Request, Response, Router } from 'express';

import { IsAuthorizedUserMiddleware } from '@deporty-org/core';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { of } from 'rxjs';
import { CreateTeamUsecase, TeamNameAlreadyExistsError } from '../domain/usecases/create-team/create-team.usecase';
import { DeleteTeamUsecase } from '../domain/usecases/delete-team/delete-team.usecase';
import { GetMemberByIdUsecase, MemberDoesNotExistError } from '../domain/usecases/get-member-by-id/get-member-by-id.usecase';
import { GetMembersByTeamUsecase } from '../domain/usecases/get-members-by-team/get-members-by-team.usecase';
import { GetSportByIdUsecase, SportDoesNotExistError } from '../domain/usecases/get-sport-by-id/get-sport-by-id.usecase';
import { GetTeamByIdUsecase, TeamDoesNotExistError } from '../domain/usecases/get-team-by-id/get-team-by-id.usecase';
import { GetTeamByNameUsecase, TeamWithNameDoesNotExistError } from '../domain/usecases/get-team-by-name/get-team-by-name.usecase';
import { GetTeamByAdvancedFiltersUsecase } from '../domain/usecases/get-teams-by-advanced-filters/get-teams-by-advanced-filters.usecase';
import { GetTeamByFiltersUsecase } from '../domain/usecases/get-teams-by-filters/get-teams-by-filters.usecase';
import { GetTeamsUsecase } from '../domain/usecases/get-teams/get-teams.usecase';
import { JWT_SECRET, SERVER_NAME } from './teams.constants';
import { GetTournamentInscriptionsByTeamIdUsecase } from '../domain/usecases/get-tournament-inscriptions-by-team-id/get-tournament-inscriptions-by-team-id.usecase';

export class TeamController extends HttpController {
  constructor() {
    super();
  }

  static identifier = SERVER_NAME;

  static registerEntryPoints(router: Router, container: Container) {
    const middleware = container.getInstance<IsAuthorizedUserMiddleware>('IsAuthorizedUserMiddleware').instance;
    const validator = (i: string) => (middleware ? middleware.getValidator(i, JWT_SECRET) : () => of(false));

    router.get(`/ready`, this.readyHandler as any);

    router.delete(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'DELETE:SUCCESS',
        extraData: {
          entitiesName: 'team',
        },
      };

      this.handler<DeleteTeamUsecase>({
        container,
        usecaseId: 'DeleteTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });

    router.get(`/all`, validator('GetTeamsUsecase'), (request: Request, response: Response) => {
      const params = request.query;
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'teams',
        },
      };

      this.handler<GetTeamsUsecase>({
        container,
        usecaseId: 'GetTeamsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          pageNumber: parseInt(params.pageNumber as string),
          pageSize: parseInt(params.pageSize as string),
        },
      });
    });
    router.get(`/filter`, (request: Request, response: Response) => {
      const params = request.query;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'teams',
        },
      };

      this.handler<GetTeamByFiltersUsecase>({
        container,
        usecaseId: 'GetTeamByFiltersUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.post(`/advanced-filter`, (request: Request, response: Response) => {
      const params = request.body;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          entitiesName: 'teams',
        },
      };

      this.handler<GetTeamByAdvancedFiltersUsecase>({
        container,
        usecaseId: 'GetTeamByAdvancedFiltersUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/name/:name`, (request: Request, response: Response) => {
      const name = request.params.name;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          [TeamWithNameDoesNotExistError.id]: 'GET:NAME:ERROR',
        },
        successCode: {
          code: 'GET:NAME:SUCCESS',
          message: 'Information for team with name {name}',
        },
        extraData: {
          name,
        },
      };

      this.handler<GetTeamByNameUsecase>({
        container,
        usecaseId: 'GetTeamByNameUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: name,
      });
    });

    router.get(`/:id/members`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,

        successCode: {
          code: 'GET-MEMBERS-BY-TEAM-ID:SUCCESS',
          message: 'Information for team with id {id}',
        },
        extraData: {
          id: id,
        },
      };

      this.handler<GetMembersByTeamUsecase>({
        container,
        usecaseId: 'GetMembersByTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
    router.get(`/:teamId/tournament-inscriptions`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TOURNAMENT-INSCRIPTIONS-GOTTEN:SUCCESS',
      };
      this.handler<GetTournamentInscriptionsByTeamIdUsecase>({
        container,
        usecaseId: 'GetTournamentInscriptionsByTeamIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: request.params.teamId,
      });
    });
    router.get(`/:teamId/member/:memberId`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        exceptions: {
          [MemberDoesNotExistError.id]: 'GET-MEMBER-BY-ID:ERROR',
        },
        identifier: this.identifier,
        successCode: 'GET-MEMBER-BY-ID:SUCCESS',
        extraData: {
          id: params,
        },
      };

      this.handler<GetMemberByIdUsecase>({
        container,
        usecaseId: 'GetMemberByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: MessagesConfiguration = {
        exceptions: {
          [TeamDoesNotExistError.id]: 'GET:ID:ERROR',
        },
        identifier: this.identifier,

        successCode: {
          code: 'GET-BY-ID:SUCCESS',
          message: 'Information for team with id {id}',
        },
        extraData: {
          id: id,
        },
      };

      this.handler<GetTeamByIdUsecase>({
        container,
        usecaseId: 'GetTeamByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
    router.get(`/sport/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: MessagesConfiguration = {
        exceptions: {
          [SportDoesNotExistError.id]: 'GET-SPORT-ID:ERROR',
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

      this.handler<GetSportByIdUsecase>({
        container,
        usecaseId: 'GetSportByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });

    router.post(`/`, (request: Request, response: Response) => {
      const team = request.body;

      const config: MessagesConfiguration = {
        exceptions: {
          [TeamNameAlreadyExistsError.id]: 'POST:ERROR',
        },
        identifier: this.identifier,

        successCode: 'POST:SUCCESS',
        extraData: {
          entitiesName: 'Team',
        },
      };

      this.handler<CreateTeamUsecase>({
        container,
        usecaseId: 'CreateTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: team,
      });
    });

    // app.put(`/assign-player`, (request: Request, response: Response) => {
    //   const data = request.body;

    //   const config: MessagesConfiguration = {
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

    //     const config: MessagesConfiguration = {
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
