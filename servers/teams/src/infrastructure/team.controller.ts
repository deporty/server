import { Request, Response, Router } from 'express';

import { IsAuthorizedUserMiddleware } from '@deporty-org/core';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { of } from 'rxjs';
import {
  CreateTeamUsecase,
  TeamNameAlreadyExistsError,
  UserCreatorIdNotProvidedError,
} from '../domain/usecases/create-team/create-team.usecase';
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
import {
  AsignNewMemberToTeamUsecase,
  MemberIsAlreadyInTeamError,
} from '../domain/usecases/asign-new-member-to-team/asign-new-member-to-team.usecase';
import { EditMemberByIdUsecase } from '../domain/usecases/edit-member-by-id/edit-member-by-id.usecase';
import { CreateUserAndAsignNewMemberToTeamUsecase } from '../domain/usecases/create-user-and-asign-new-member-to-team/create-user-and-asign-new-member-to-team.usecase';
import { Logger } from '@scifamek-open-source/logger';
import { EditTeamUsecase, UserImageNotAllowedError } from '../domain/usecases/edit-team/edit-team.usecase';
import { DeleteMemberByIdUsecase } from '../domain/usecases/delete-member-by-id/delete-member-by-id.usecase';
import { SaveTournamentInscriptionsByTeamUsecase } from '../domain/usecases/save-tournament-inscriptions-by-team/save-tournament-inscriptions-by-team.usecase';
import { GetOnlyMembersByTeamUsecase } from '../domain/usecases/get-only-members-by-team/get-only-members-by-team.usecase';
import { CreateTeamAndMembersFromFileUsecase } from '../domain/usecases/create-team-and-members-from-file/create-team-and-members-from-file.usecase';
import { EndMemberParticipationUsecase } from '../domain/usecases/end-member-participation/end-member-participation.usecase';
import { GetTeamsByIdsUsecase } from '../domain/usecases/get-teams-by-ids/get-teams-by-ids.usecase';
import { PromoteMembersUsecase } from '../domain/usecases/promote-members/promote-members.usecase';
import { GetOnlyMemberByIdUsecase } from '../domain/usecases/get-only-member-by-id/get-only-member-by-id.usecase';
import { UpdateTournamentInscriptionsByTeamUsecase } from '../domain/usecases/update-tournament-inscriptions-by-team/update-tournament-inscriptions-by-team.usecase';
import { ChangeMemberToAnotherTeamUsecase } from '../domain/usecases/change-member-to-another-team/change-member-to-another-team.usecase';

export class TeamController extends HttpController {
  constructor() {
    super();
  }

  static identifier = SERVER_NAME;

  static registerEntryPoints(router: Router, container: Container) {
    const logger = container.getInstance<Logger>('Logger').instance;
    this.logger = logger;
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
    router.delete(`/:teamId/member/:memberId`, (request: Request, response: Response) => {
      const teamId = request.params.teamId;
      const memberId = request.params.memberId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'DELETED-MEMBER:SUCCESS',
        extraData: {
          entitiesName: 'team',
        },
      };

      this.handler<DeleteMemberByIdUsecase>({
        container,
        usecaseId: 'DeleteMemberByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          teamId,
          memberId,
        },
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

    router.post(`/change-member-to-another-team`, (request: Request, response: Response) => {
      const params = request.body;
      

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'CHANGED-MEMBER-TO-ANOTHER-TEAM:SUCCESS',
      };

      this.handler<ChangeMemberToAnotherTeamUsecase>({
        container,
        usecaseId: 'ChangeMemberToAnotherTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.post(`/create-user-and-asign-new-member-to-team`, (request: Request, response: Response) => {
      const body = {
        ...request.body,
        user: {
          ...request.body.user,
          birthDate: request.body.user.birthDate,
        },
      };
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'CREATE-USER-AND-ASIGN-NEW-MEMBER-TO-TEAM:SUCCESS',
        exceptions: {
          UserAlreadyExistError: 'USER-ALREADY-EXIST:ERROR',
          InsuficientUserDataError: 'INSUFICIENT-USER-DATA:ERROR',
          MultipleUserWithUniqueDataError: 'MULTIPLE-USER-WITH-UNIQUE-DATA:ERROR',
        },
        extraData: {
          entitiesName: 'teams',
        },
      };

      this.handler<CreateUserAndAsignNewMemberToTeamUsecase>({
        container,
        usecaseId: 'CreateUserAndAsignNewMemberToTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
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

    router.get(`/:teamId/only-members`, (request: Request, response: Response) => {
      const teamId = request.params.teamId;
      const query = request.query;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-MEMBERS-BY-TEAM-ID:SUCCESS',
      };

      this.handler<GetOnlyMembersByTeamUsecase>({
        container,
        usecaseId: 'GetOnlyMembersByTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: { teamId, ...query },
      });
    });
    router.put(`/create-team-and-members-from-file`, (request: Request, response: Response) => {
      const body = request.body;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          [TeamNameAlreadyExistsError.id]: 'TEAM-NAME-ALREADY-EXISTS:ERROR',
          [UserCreatorIdNotProvidedError.id]: 'USER-CREATOR-ID-NOT-PROVIDED:ERROR',
          SizePropertyError: 'SIZE-PROPERTY:ERROR',
        },
        successCode: 'GET-MEMBERS-BY-TEAM-ID:SUCCESS',
      };

      this.handler<CreateTeamAndMembersFromFileUsecase>({
        container,
        usecaseId: 'CreateTeamAndMembersFromFileUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
    router.post(`/:teamId/member/:memberId/end-participation`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'END-MEMBER-PARTICIPATION:SUCCESS',
      };

      this.handler<EndMemberParticipationUsecase>({
        container,
        usecaseId: 'EndMemberParticipationUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: request.params,
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
    router.post(`/:teamId/tournament-inscription`, (request: Request, response: Response) => {

      const params = {
        ...request.body,
        enrollmentDate: new Date(request.body.enrollmentDate),
      };
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TOURNAMENT-INSCRIPTIONS-ADDED:SUCCESS',
      };
      this.handler<SaveTournamentInscriptionsByTeamUsecase>({
        container,
        usecaseId: 'SaveTournamentInscriptionsByTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.patch(`/:teamId/tournament-inscription`, (request: Request, response: Response) => {
      const params = {
        ...request.body,
        enrollmentDate: new Date(request.body.enrollmentDate),
      };
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TOURNAMENT-INSCRIPTIONS-UPDATED:SUCCESS',
      };
      this.handler<UpdateTournamentInscriptionsByTeamUsecase>({
        container,
        usecaseId: 'UpdateTournamentInscriptionsByTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
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
    router.get(`/:teamId/member/:memberId/only-member`, (request: Request, response: Response) => {
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

      this.handler<GetOnlyMemberByIdUsecase>({
        container,
        usecaseId: 'GetOnlyMemberByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/teams-by-ids`, (request: Request, response: Response) => {
      const ids = request.query.teamIds;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-BY-IDS:SUCCESS',
      };

      this.handler<GetTeamsByIdsUsecase>({
        container,
        usecaseId: 'GetTeamsByIdsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: ids ? (Array.isArray(ids) ? ids : [ids]) : [],
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
          [TeamNameAlreadyExistsError.id]: 'TEAM-NAME-ALREADY-EXISTS:ERROR',
          [UserCreatorIdNotProvidedError.id]: 'USER-CREATOR-ID-NOT-PROVIDED:ERROR',
          SizePropertyError: 'SIZE-PROPERTY:ERROR',
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

    router.patch(`/promote-members`, (request: Request, response: Response) => {
      const body = {
        ...request.query,
        removeFromOrigin: request.query.removeFromOrigin === 'true',
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'PATCH:SUCCESS',
      };

      this.handler<PromoteMembersUsecase>({
        container,
        usecaseId: 'PromoteMembersUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });

    router.patch(`/:teamId`, (request: Request, response: Response) => {
      const body = {
        id: request.params.teamId,
        ...request.body,
      };

      const config: MessagesConfiguration = {
        exceptions: {
          [TeamDoesNotExistError.id]: 'GET:ID:ERROR',
          [TeamNameAlreadyExistsError.id]: 'TEAM-NAME-ALREADY-EXISTS:ERROR',
          [UserImageNotAllowedError.id]: 'TEAM-SHIELD-INVALID:ERROR',
        },
        identifier: this.identifier,
        successCode: 'PATCH:SUCCESS',
        extraData: {
          entitiesName: 'Team',
        },
      };

      this.handler<EditTeamUsecase>({
        container,
        usecaseId: 'EditTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });

    router.put(`/assign-member`, (request: Request, response: Response) => {
      const data = request.body;
      const config: MessagesConfiguration = {
        exceptions: {
          [MemberIsAlreadyInTeamError.id]: 'MEMBER-IS-ALREADY-IN-TEAM:ERROR',
        },
        identifier: this.identifier,
        successCode: 'MEMBER-ASSIGNED:SUCCESS',
      };
      this.handler<AsignNewMemberToTeamUsecase>({
        container,
        usecaseId: 'AsignNewMemberToTeamUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });

    router.patch(`/:teamId/member/:memberId`, (request: Request, response: Response) => {
      const data = {
        ...request.body,
        teamId: request.params.teamId,
        memberId: request.params.memberId,
      };
      const config: MessagesConfiguration = {
        exceptions: {
          [MemberDoesNotExistError.id]: 'MEMBER-DOES-NOT-EXIST:ERROR',
        },
        identifier: this.identifier,
        successCode: 'MEMBER-UPDATED:SUCCESS',
      };
      this.handler<EditMemberByIdUsecase>({
        container,
        usecaseId: 'EditMemberByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });

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
