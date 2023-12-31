import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Logger } from '@scifamek-open-source/logger';
import { Request, Response, Router } from 'express';
import { AsignRolesToUserUsecase } from '../domain/usecases/asign-roles-to-user/asign-roles-to-user.usecase';
import { DeleteUserUsecase, UserIsSelfManagedError } from '../domain/usecases/delete-user/delete-user.usecase';
import { EditUserByIdUsecase, UserImageNotAllowedError } from '../domain/usecases/edit-user-by-id/edit-user-by-id.usecase';
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
import { InsuficientUserDataError, SaveUserUsecase, UserAlreadyExistError } from '../domain/usecases/save-user/save-user.usecase';
import { AddTeamParticipationUsecase } from '../domain/usecases/team-participations/add-team-participation/add-team-participation.usecase';
import { DeleteTeamParticipationUsecase } from '../domain/usecases/team-participations/delete-team-participation/delete-team-participation.usecase';
import { GetTeamsThatIBelongUsecase } from '../domain/usecases/team-participations/get-teams-that-i-belong/get-teams-that-i-belong.usecase';
import { SERVER_NAME } from './users.constants';

import {
  GetUserByDocumentUsecase,
  UserWithDocumentDoesNotExistError,
} from '../domain/usecases/get-user-by-document/get-user-by-document.usecase';
import { GetUserByUniqueFieldsUsecase } from '../domain/usecases/get-user-by-unique-fields/get-user-by-unique-fields.usecase';
import { EditTeamParticipationUsecase } from '../domain/usecases/team-participations/edit-team-participation/edit-team-participation.usecase';
import { GetTeamParticipationByPropertiesUsecase } from '../domain/usecases/team-participations/get-team-participation-by-properties/get-team-participation-by-properties.usecase';
import { GetUserByDocumentAndRolesUsecase } from '../domain/usecases/get-user-by-document-and-roles/get-user-by-document-and-roles.usecase';
const moment = require('moment-timezone');

export class UserController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();

    moment.tz.setDefault('America/Bogota');

  }

  static registerEntryPoints(router: Router, container: Container) {
    router.get(`/ready`, this.readyHandler as any);

    const logger = container.getInstance<Logger>('Logger').instance;
    this.logger = logger;

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
    router.get(`/document/:document`, (request: Request, response: Response) => {
      const document = request.params.document;

      const config: MessagesConfiguration = {
        exceptions: {
          [UserWithDocumentDoesNotExistError.id]: 'GET-BY-DOCUMENT:ERROR',
        },
        identifier: this.identifier,
        successCode: 'GET-BY-DOCUMENT:SUCCESS',
      };

      this.handler<GetUserByDocumentUsecase>({
        container,
        usecaseId: 'GetUserByDocumentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: document,
      });
    });
    router.get(`/document-and-roles`, (request: Request, response: Response) => {
      let roles: string[] = request.query.roles as string[];
      if (roles) {
        if (!Array.isArray(request.query.roles)) {
          roles = [request.query.roles as string];
        }
      }
      const param = {
        document: request.query.document,
        roles: roles,
      };

      const config: MessagesConfiguration = {
        exceptions: {
          [UserWithDocumentDoesNotExistError.id]: 'GET-BY-DOCUMENT:ERROR',
        },
        identifier: this.identifier,
        successCode: 'GET-BY-DOCUMENT:SUCCESS',
      };

      this.handler<GetUserByDocumentAndRolesUsecase>({
        container,
        usecaseId: 'GetUserByDocumentAndRolesUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: param,
      });
    });

    router.get(`/:userId/teams-participations/by-properties`, (request: Request, response: Response) => {
      // GetTeamParticipationByPropertiesUsecase
      const body = {
        ...request.params,
        ...request.query,
        initDate: request.query.initDate ? new Date(request.query.initDate as string) : undefined,
        enrollmentDate: request.query.enrollmentDate ? new Date(request.query.enrollmentDate as string) : undefined,
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-PARTICIPATIONS:SUCCESS',
      };

      this.handler<GetTeamParticipationByPropertiesUsecase>({
        container,
        usecaseId: 'GetTeamParticipationByPropertiesUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });

    router.get(`/:userId/teams-participations`, (request: Request, response: Response) => {
      const userId = request.params.userId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TEAMS-THAT-I-BELONG:SUCCESS',
      };

      this.handler<GetTeamsThatIBelongUsecase>({
        container,
        usecaseId: 'GetTeamsThatIBelongUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: userId,
      });
    });
    router.get(`/get-user-by-unique-fields/:document/:email`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        identifier: this.identifier,

        successCode: 'GET-USER-BY-UNIQUE-FIELDS:SUCCESS',
      };

      this.handler<GetUserByUniqueFieldsUsecase>({
        container,
        usecaseId: 'GetUserByUniqueFieldsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.post(`/:userId/team-participation`, (request: Request, response: Response) => {
      const body = {
        ...request.body,

        teamParticipation: {
          ...request.body.teamParticipation,
          initDate: request.body.teamParticipation.initDate ? new Date(request.body.teamParticipation.initDate) : undefined,
          enrollmentDate: request.body.teamParticipation.enrollmentDate
            ? new Date(request.body.teamParticipation.enrollmentDate)
            : undefined,
        },
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TEAM-PARTICIPATION-ADDED:SUCCESS',
      };

      this.handler<AddTeamParticipationUsecase>({
        container,
        usecaseId: 'AddTeamParticipationUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
    router.delete(`/:userId/team-participation/:teamId`, (request: Request, response: Response) => {
      const body = {
        ...request.params,
      };
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TEAM-PARTICIPATION-DELETED:SUCCESS',
      };

      this.handler<DeleteTeamParticipationUsecase>({
        container,
        usecaseId: 'DeleteTeamParticipationUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
    router.patch(`/:userId/team-participation/:teamParticipationId`, (request: Request, response: Response) => {
      const body = {
        ...request.params,
        teamParticipation: {
          ...request.body,
          id: request.params.teamParticipationId,
          initDate: request.body.initDate ? new Date(request.body.initDate) : undefined,
          retirementDate: request.body.retirementDate ? new Date(request.body.retirementDate) : undefined,
          enrollmentDate: request.body.enrollmentDate ? new Date(request.body.enrollmentDate) : undefined,
        },
      };
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TEAM-PARTICIPATION-UPDATED:SUCCESS',
      };

      this.handler<EditTeamParticipationUsecase>({
        container,
        usecaseId: 'EditTeamParticipationUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });

    router.post(`/`, (request: Request, response: Response) => {
      const body = {
        ...request.body,
        birthDate: request.body.birthDate ? moment(request.body.birthDate).toDate() : null,
      };

      console.log(body);
      // response.status(500);

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'POST:SUCCESS',
        exceptions: {
          [UserAlreadyExistError.id]: 'USER-ALREADY-EXIST:ERROR',
          [InsuficientUserDataError.id]: 'INSUFICIENT-USER-DATA:ERROR',
        },
        extraData: {
          entitiesName: 'User',
        },
      };

      this.handler<SaveUserUsecase>({
        container,
        usecaseId: 'SaveUserUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
    router.patch(`/:userId`, (request: Request, response: Response) => {
      const body = {
        ...request.body,
        id: request.params.userId,
        user: {
          ...request.body.user,
          birthDate: request.body.user.birthDate ? new Date(request.body.user.birthDate) : null,
        },
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'EDITED-USER-BY-ID:SUCCESS',
        exceptions: {
          [UserImageNotAllowedError.id]: 'USER-IMAGE-NOT-ALLOWED:ERROR',
          [UserDoesNotExistByIdError.id]: 'USER-DOES-NOT-EXIST-BY-ID:ERROR',
        },
      };

      this.handler<EditUserByIdUsecase>({
        container,
        usecaseId: 'EditUserByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });
    router.delete(`/:userId`, (request: Request, response: Response) => {
      const body = {
        ...request.body,
        birthDate: request.body.birthDate,
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          [UserDoesNotExistByIdError.id]: 'USER-DOES-NOT-EXIST-BY-ID:ERROR',
          [UserIsSelfManagedError.id]: 'USER-IS-SELF-MANAGED:ERROR',
        },
        successCode: 'DELETE:SUCCESS',
      };

      this.handler<DeleteUserUsecase>({
        container,
        usecaseId: 'DeleteUserUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
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
        usecaseParam: ids ? (Array.isArray(ids) ? ids : [ids]) : [],
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
