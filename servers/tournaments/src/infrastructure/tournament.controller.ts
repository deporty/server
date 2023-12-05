import { IsAuthorizedUserMiddleware } from '@deporty-org/core';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { getDateFromSeconds } from '@scifamek-open-source/iraca/helpers';
import { HttpController, MessagesConfiguration } from '@scifamek-open-source/iraca/web-api';
import { Request, Response, Router } from 'express';
import { of } from 'rxjs';
import {
  AddTeamsToTournamentUsecase,
  TeamsArrayEmptyError,
} from '../domain/usecases/add-team-to-tournament/add-teams-to-tournament.usecase';
import {
  AddTeamsToGroupInsideTournamentUsecase,
  TeamAreNotRegisteredError,
  TeamAreRegisteredInOtherGroupError,
  ThereAreTeamRegisteredPreviuslyError,
} from '../domain/usecases/add-teams-to-group-inside-tournament/add-teams-to-group-inside-tournament.usecase';
import { CalculateTournamentCostByIdUsecase } from '../domain/usecases/calculate-tournament-cost-by-id/calculate-tournament-cost-by-id.usecase';
import { CreateMatchSheetUsecase } from '../domain/usecases/create-match-sheet/create-match-sheet.usecase';
import { CreateTournamentUsecase } from '../domain/usecases/create-tournament/create-tournament.usecase';
import { DeleteTournamentUsecase } from '../domain/usecases/delete-tournament/delete-tournament.usecase';
import { CreateFixtureStageUsecase } from '../domain/usecases/fixture-stages/create-fixture-stage/create-fixture-stage.usecase';
import { DeleteFixtureStageUsecase } from '../domain/usecases/fixture-stages/delete-fixture-stage/delete-fixture-stage.usecase';
import { GetFixtureStagesByTournamentUsecase } from '../domain/usecases/fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase';
import { GenerateMainDrawFromSchemaUsecase } from '../domain/usecases/generate-main-draw-from-schema/generate-main-draw-from-schema.usecase';
import { GetAllMatchesByDateUsecase } from '../domain/usecases/get-all-matches-by-date/get-all-matches-by-date.usecase';
import { GetAllMatchesGroupedByDateUsecase } from '../domain/usecases/get-all-matches-grouped-by-date/get-all-matches-grouped-by-date.usecase';
import { GetCurrentTournamentsUsecase } from '../domain/usecases/get-current-tournaments/get-current-tournaments.usecase';
import { GetMainDrawNodeMatchesoverviewUsecase } from '../domain/usecases/get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';
import { GetMarkersTableUsecase } from '../domain/usecases/get-markers-table/get-markers-table.usecase';
import { GetMatchesByRefereeIdUsecase } from '../domain/usecases/get-matches-by-referee-id/get-matches-by-referee-id.usecase';
import { GetPosibleTeamsToAddUsecase } from '../domain/usecases/get-posible-teams-to-add/get-posible-teams-to-add.usecase';
import { GetPositionsTableByGroupUsecase } from '../domain/usecases/get-positions-table-by-group.usecase';
import { GetRegisterTeamQRUsecase } from '../domain/usecases/get-register-team-qr/get-register-team-qr.usecase';
import { GetTournamentByIdUsecase } from '../domain/usecases/get-tournament-by-id/get-tournament-by-id.usecase';
import { GetTournamentsByOrganizationAndTournamentLayoutUsecase } from '../domain/usecases/get-tournaments-by-organization/get-tournaments-by-organization.usecase';
import { GetTournamentsByRatioUsecase } from '../domain/usecases/get-tournaments-by-ratio/get-tournaments-by-ratio.usecase';
import { GetTournamentsForCheckInUsecase } from '../domain/usecases/get-tournaments-for-check-in/get-tournaments-for-check-in.usecase';
import { GetTournamentsUsecase } from '../domain/usecases/get-tournaments/get-tournaments.usecase';
import { AddMatchToGroupInsideTournamentUsecase } from '../domain/usecases/group-matches/add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase';
import { EditMatchInsideGroupUsecase } from '../domain/usecases/group-matches/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase';
import { GetGroupMatchesUsecase } from '../domain/usecases/group-matches/get-group-matches/get-group-matches.usecase';
import { GetNewMatchesToAddInGroupUsecase } from '../domain/usecases/group-matches/get-new-matches-to-add-in-group/get-new-matches-to-add-in-group.usecase';
import { DeleteGroupByIdUsecase } from '../domain/usecases/groups/delete-group-by-id/delete-group-by-id.usecase';
import { DeleteTeamsInGroupUsecase } from '../domain/usecases/groups/delete-teams-in-group/delete-teams-in-group.usecase';
import { GetGroupByIdUsecase } from '../domain/usecases/groups/get-group-by-id/get-group-by-id.usecase';
import { GetGroupsByFixtureStageUsecase } from '../domain/usecases/groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';
import { PublishAllMatchesByGroupUsecase } from '../domain/usecases/groups/publish-all-matches-by-group/publish-all-matches-by-group.usecase';
import { SaveGroupUsecase } from '../domain/usecases/groups/save-group/save-group.usecase';
import { UpdateGroupUsecase } from '../domain/usecases/groups/update-group/update-group.usecase';
import { UpdateTeamsInGroupUsecase } from '../domain/usecases/groups/update-teams-in-group/update-teams-in-group.usecase';
import { AddIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/add-intergroup-match/add-intergroup-match.usecase';
import { DeleteIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/delete-intergroup-match/delete-intergroup-match.usecase';
import { EditIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/edit-intergroup-match/edit-intergroup-match.usecase';
import { GetIntergroupMatchesUsecase } from '../domain/usecases/intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase';
import { IsASchemaValidForMainDrawUsecase } from '../domain/usecases/is-a-schema-valid-for-main-draw/is-a-schema-valid-for-main-draw.usecase';
import { CreateNodeMatchUsecase } from '../domain/usecases/main-draw/create-node-match/create-node-match.usecase';
import { DeleteNodeMatchUsecase } from '../domain/usecases/main-draw/delete-node-match/delete-node-match.usecase';
import { EditNodeMatchUsecase } from '../domain/usecases/main-draw/edit-node-match/edit-node-match.usecase';
import { ModifyTournamentLocationsUsecase } from '../domain/usecases/modify-tournament-locations/modify-tournament-locations.usecase';
import { ModifyTournamentRefereesUsecase } from '../domain/usecases/modify-tournament-referees/modify-tournament-referees.usecase';
import { ModifyTournamentStatusUsecase } from '../domain/usecases/modify-tournament-status/modify-tournament-status.usecase';
import { DeleteRegisteredTeamByIdUsecase } from '../domain/usecases/registered-team/delete-registered-team-by-id/delete-registered-team-by-id.usecase';
import { GetRegisteredTeamsByTournamentIdUsecase } from '../domain/usecases/registered-team/get-registered-teams-by-tournaments/get-registered-teams-by-tournaments.usecase';
import { ModifyRegisteredTeamStatusUsecase } from '../domain/usecases/registered-team/modify-registered-team-status/modify-registered-team-status.usecase';
import { JWT_SECRET, SERVER_NAME } from './tournaments.constants';
import { GetTournamentBaseInformationByIdUsecase } from '../domain/usecases/get-tournament-base-information-by-id/get-tournament-base-information-by-id.usecase';
import {
  MemberIdsNotFoundError,
  RequiredDocsForMembersIncompleteError,
  RequiredDocsForTeamIncompleteError,
  RequiredDocsNoPresentError,
  TeamAlreadyRegisteredError,
} from '../domain/usecases/registered-team/register-team-into-a-tournament/register-team-into-a-tournament.usecase';
import { GetRunningTournamentsWhereExistsTeamIdUsecase } from '../domain/usecases/get-running-tournaments-where-exists-team-id/get-running-tournaments-where-exists-team-id.usecase';
import { GetCardsReportByTournamentUsecase } from '../domain/usecases/get-cards-report-by-tournament/get-cards-report-by-tournament.usecase';
import { GetCardsReportGroupedByTeamAndDateByTournamentUsecase } from '../domain/usecases/get-cards-report-grouped-by-team-and-date-by-tournament/get-cards-report-grouped-by-team-and-date-by-tournament.usecase';
import { GetLessDefeatedFenceReportUsecase } from '../domain/usecases/get-less-defeated-fence-report/get-less-defeated-fence-report.usecase';
import { ModifyTournamentFinancialStatusUsecase } from '../domain/usecases/modify-tournament-financial-status/modify-tournament-financial-status.usecase';
import { GetAvailableTournamentsByFiltersUsecase } from '../domain/usecases/get-available-tournaments-by-filters/get-available-tournaments-by-filters.usecase';
import { RegisterTeamIntoATournamentLinealUsecase } from '../domain/usecases/registered-team/register-team-into-a-tournament-lineal/register-team-into-a-tournament-lineal.usecase';
import { ModifyRequestForRequiredDocumentsUsecase } from '../domain/usecases/modify-request-for-required-documents/modify-request-for-required-documents.usecase';
import {
  DataIncompleteError,
  RequiredDocsForMemberIncompleteError,
  TeamIsNotRegisteredError,
} from '../domain/usecases/registered-team/register-single-member-into-a-tournament/register-single-member-into-a-tournament.usecase';
import { RegisterMembersIntoATournamentUsecase } from '../domain/usecases/registered-team/register-members-into-a-tournament/register-members-into-a-tournament.usecase';

export class TournamentController extends HttpController {
  static identifier = SERVER_NAME;

  constructor() {
    super();
  }

  static registerEntryPoints(router: Router, container: Container) {
    const authorizedUserMiddleware = container.getInstance<IsAuthorizedUserMiddleware>('IsAuthorizedUserMiddleware').instance;

    const validator = (resourceName: string) =>
      authorizedUserMiddleware ? authorizedUserMiddleware.getValidator(resourceName, JWT_SECRET) : () => of(false);

    router.get(`/ready`, this.readyHandler as any);

    router.put(`/match-sheet`, (request: Request, response: Response) => {
      const params = request.body;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handler<CreateMatchSheetUsecase>({
        container,
        usecaseId: 'CreateMatchSheetUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(
      `/for-check-in`,
      // validator('GetTournamentByIdUsecase'),
      (request: Request, response: Response) => {
        const id = request.params.id;

        const config: MessagesConfiguration = {
          exceptions: {
            TournamentDoesNotExistError: 'GET:ERROR',
          },
          identifier: this.identifier,
          successCode: 'GET:SUCCESS',
          extraData: {
            name: id,
          },
        };

        this.handler<GetTournamentsForCheckInUsecase>({
          container,
          usecaseId: 'GetTournamentsForCheckInUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: id,
        });
      }
    );
    router.get(
      `/filters`,
      // validator('GetTournamentByIdUsecase'),
      (request: Request, response: Response) => {
        const filters: any = { ...request.query };
        if (filters['year']) {
          filters['year'] = parseInt(filters['year']);
        }

        const config: MessagesConfiguration = {
          identifier: this.identifier,
          successCode: 'GET-FILTERED:SUCCESS',
        };

        this.handler<GetAvailableTournamentsByFiltersUsecase>({
          container,
          usecaseId: 'GetAvailableTournamentsByFiltersUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: filters,
        });
      }
    );

    router.get(`/:tournamentId/grouped-matches`, (request: Request, response: Response) => {
      const params = request.params.tournamentId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handler<GetAllMatchesGroupedByDateUsecase>({
        container,
        usecaseId: 'GetAllMatchesGroupedByDateUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.get(`/:tournamentId/base-information`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TOURNAMENT-BASE-INFORMATION:SUCCESS',
      };

      this.handler<GetTournamentBaseInformationByIdUsecase>({
        container,
        usecaseId: 'GetTournamentBaseInformationByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: request.params.tournamentId,
      });
    });

    router.put(`/:tournamentId/generate-main-draw`, (request: Request, response: Response) => {
      const params = request.params.tournamentId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          GroupsAndSchemaDontMatchError: 'GROUPS-AND-SCHEMA-DONT-MATCH:ERROR',
          SchemaNoSelectedError: 'SCHEMA-NO-SELECTED:ERROR',
          TeamsAmmountInClasificationError: 'TEAMS-AMMOUNT-IN-CLASIFICATION:ERROR',
          ExistNodeMatchesError: 'EXIST-NODE-MATCHES:ERROR',
        },
        successCode: {
          code: 'MAIN-DRAW-GENERATED:SUCCESS',
        },
      };

      this.handler<GenerateMainDrawFromSchemaUsecase>({
        container,
        usecaseId: 'GenerateMainDrawFromSchemaUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/matches-by-referee-id/:refereeId`, (request: Request, response: Response) => {
      const params = request.params.refereeId;

      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MATCHES-BY-REFEREE-ID:SUCCESS',
          message: 'The main matches was returned',
        },
      };
      this.handler<GetMatchesByRefereeIdUsecase>({
        container,
        usecaseId: 'GetMatchesByRefereeIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.post(`/:tournamentId/modify-request-for-required-docs`, (request: Request, response: Response) => {
      const params = { ...request.body, ...request.params };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'MODIFIED-REQUEST-FOR-REQUIRED-DOCS:SUCCESS',
      };

      this.handler<ModifyRequestForRequiredDocumentsUsecase>({
        container,
        usecaseId: 'ModifyRequestForRequiredDocumentsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`,
      validator('AddIntergroupMatchUsecase'),
      (request: Request, response: Response) => {
        const params = request.body;

        const config: MessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'GET-MAIN-DRAW:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handler<AddIntergroupMatchUsecase>({
          container,
          usecaseId: 'AddIntergroupMatchUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );

    router.get(`/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handler<GetIntergroupMatchesUsecase>({
        container,
        usecaseId: 'GetIntergroupMatchesUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          ...params,
          states: request.query.states,
        },
      });
    });
    router.delete(`/:tournamentId/node-match/:nodeMatchId`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'NODE-MATCH-DELETED:SUCCESS',
      };

      this.handler<DeleteNodeMatchUsecase>({
        container,
        usecaseId: 'DeleteNodeMatchUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match/:intergroupMatchId`,
      validator('DeleteIntergroupMatchUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: MessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'GET-MAIN-DRAW:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handler<DeleteIntergroupMatchUsecase>({
          container,
          usecaseId: 'DeleteIntergroupMatchUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );
    router.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`,
      validator('EditIntergroupMatchUsecase'),

      (request: Request, response: Response) => {
        const config: MessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'EDITED-INTERGROUP-MATCH:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handler<EditIntergroupMatchUsecase>({
          container,
          usecaseId: 'EditIntergroupMatchUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: {
            ...request.params,
            intergroupMatch: {
              ...request.body,
              match: {
                ...request.body.match,
                date: request.body.match.date ? getDateFromSeconds(request.body.match.date) : undefined,
              },
            },
          },
        });
      }
    );

    router.get(`/markers-table/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handler<GetMarkersTableUsecase>({
        container,
        usecaseId: 'GetMarkersTableUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
    router.get(`/:tournamentId/less-defeated-fence`, (request: Request, response: Response) => {
      const id = request.params.tournamentId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handler<GetLessDefeatedFenceReportUsecase>({
        container,
        usecaseId: 'GetLessDefeatedFenceReportUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
    router.get(`/by-position`, validator('GetTournamentsByRatioUsecase'), (request: Request, response: Response) => {
      const params = request.query;

      const id = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handler<GetTournamentsByRatioUsecase>({
        container,
        usecaseId: 'GetTournamentsByRatioUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          origin: {
            latitude: parseFloat(params.latitude as string),
            longitude: parseFloat(params.longitude as string),
          },
          ratio: parseFloat(params.ratio as string),
        },
      });
    });

    router.get(`/:tournamentId/cost`, (request: Request, response: Response) => {
      const id = request.params.tournamentId;

      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handler<CalculateTournamentCostByIdUsecase>({
        container,
        usecaseId: 'CalculateTournamentCostByIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });

    router.put(`/add-team`, validator('AddTeamsToTournamentUsecase'), (request: Request, response: Response) => {
      const params = request.body;

      const config: MessagesConfiguration = {
        exceptions: {
          TeamWasAlreadyRegistered: 'TEAM-ALREADY-REGISTERED:ERROR',
          [TeamsArrayEmptyError.id]: 'TEAMS-ARRAY-EMTPY:ERROR',
          TeamDoesNotHaveMembers: 'TEAM-WITH-OUT-MEMBERS:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'TEAM-ALREADY-REGISTERED:ERROR': '{message}',
          'TEAM-WITH-OUT-MEMBERS:ERROR': '{message}',
        },
        successCode: 'TEAM-REGISTERED:SUCCESS',
        extraData: {
          ...params,
        },
      };

      this.handler<AddTeamsToTournamentUsecase>({
        container,
        usecaseId: 'AddTeamsToTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.post(`/is-a-schema-valid-for-main-draw`, (request: Request, response: Response) => {
      const schema = request.body;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'SCHEMA-ANALIZED:SUCCESS',
      };

      this.handler<IsASchemaValidForMainDrawUsecase>({
        container,
        usecaseId: 'IsASchemaValidForMainDrawUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: schema,
      });
    });

    router.get(`/available-teams-to-add/:id`, validator('GetPosibleTeamsToAddUsecase'), (request: Request, response: Response) => {
      const tournamentId = request.params.id;
      const query = request.query;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-AVAILABLE-TEAMS:SUCCESS',
          message: 'Available teams for the tournament with id "{id}"',
        },
        extraData: {
          id: tournamentId,
        },
      };

      this.handler<GetPosibleTeamsToAddUsecase>({
        container,
        usecaseId: 'GetPosibleTeamsToAddUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          tournamentId,
          ...query,
        },
      });
    });

    router.get(`/`, (request: Request, response: Response) => {
      const params = request.query;
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
      };

      this.handler<GetTournamentsUsecase>({
        container,
        usecaseId: 'GetTournamentsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.get(`/current-tournaments`, (request: Request, response: Response) => {
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
      };

      this.handler<GetCurrentTournamentsUsecase>({
        container,
        usecaseId: 'GetCurrentTournamentsUsecase',
        response,
        messageConfiguration: config,
      });
    });
    router.get(`/get-matches-by-date/:date`, (request: Request, response: Response) => {
      const date = new Date(request.params.date);

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET:SUCCESS',
      };

      this.handler<GetAllMatchesByDateUsecase>({
        container,
        usecaseId: 'GetAllMatchesByDateUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: date,
      });
    });

    router.get(`/by-organization-and-tournament-layout`, (request: Request, response: Response) => {
      const params: any = request.query;
      params['includeDraft'] = params['includeDraft'] == 'true';
      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handler<GetTournamentsByOrganizationAndTournamentLayoutUsecase>({
        container,
        usecaseId: 'GetTournamentsByOrganizationAndTournamentLayoutUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.delete(`/:tournamentLayoutId`, validator('DeleteTournamentUsecase'), (request: Request, response: Response) => {
      const params = request.params.tournamentLayoutId;
      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'DELETE:SUCCESS',
      };

      this.handler<DeleteTournamentUsecase>({
        container,
        usecaseId: 'DeleteTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/:id/fixture-stages`, (request: Request, response: Response) => {
      const id = request.params.id;
      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handler<GetFixtureStagesByTournamentUsecase>({
        container,
        usecaseId: 'GetFixtureStagesByTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: id,
      });
    });
    router.post(`/:id/fixture-stage`, validator('CreateFixtureStageUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const config: MessagesConfiguration = {
        exceptions: {
          FixtureStageAlreadyExistsError: 'FIXTURE-ALREADY-EXISTS:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'FIXTURE-ALREADY-EXISTS:ERROR': '{message}',
        },
        successCode: 'FIXTURE-STAGE-SAVE:SUCCESS',
        extraData: {},
      };

      this.handler<CreateFixtureStageUsecase>({
        container,
        usecaseId: 'CreateFixtureStageUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });

    router.get(`/:tournamentId/fixture-stage/:fixtureStageId/groups`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        identifier: this.identifier,

        successCode: 'GET-GROUPS-IN-FIXTURE-STAGES:SUCCESS',
      };

      this.handler<GetGroupsByFixtureStageUsecase>({
        container,
        usecaseId: 'GetGroupsByFixtureStageUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/:tournamentId/grouped-cards-report`, (request: Request, response: Response) => {
      const tournamentId = request.params.tournamentId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-GROUPED-CARDS-REPORT:SUCCESS',
      };

      this.handler<GetCardsReportGroupedByTeamAndDateByTournamentUsecase>({
        container,
        usecaseId: 'GetCardsReportGroupedByTeamAndDateByTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: tournamentId,
      });
    });

    router.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`,
      validator('DeleteGroupByIdUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: MessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,

          successCode: 'GROUP-DELETED:SUCCESS',
        };

        this.handler<DeleteGroupByIdUsecase>({
          container,
          usecaseId: 'DeleteGroupByIdUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );
    router.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/publish-all-matches`,
      //TODO: Add this validator when the authorization dashboard get ready
      //validator('PublishAllMatchesByGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;
        const config: MessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,

          successCode: 'MATCHES-PUBLISHED:SUCCESS',
        };

        this.handler<PublishAllMatchesByGroupUsecase>({
          container,
          usecaseId: 'PublishAllMatchesByGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );
    router.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/teams`,
      validator('DeleteTeamsInGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;
        const teamIds = request.body;

        params.teamIds = teamIds;

        const config: MessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-NOT-FOUND:ERROR': '{message}',
          },
          successCode: 'TEAMS-DELETED-FROM-GROUP:SUCCESS',
        };

        this.handler<DeleteTeamsInGroupUsecase>({
          container,
          usecaseId: 'DeleteTeamsInGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );

    router.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/group`,
      validator('SaveGroupUsecase'),
      (request: Request, response: Response) => {
        const params = { ...request.params, group: request.body };
        const config: MessagesConfiguration = {
          exceptions: {
            GroupAlreadyExistsError: 'GROUP-ALREADY-EXISTS:ERROR',
            LabelMustBeProvidedError: 'LABEL-NOT-PROVIDED:ERROR',
            OrderMustBeProvidedError: 'ORDER-NOT-PROVIDED:ERROR',
          },
          identifier: this.identifier,

          successCode: 'GROUP-SAVED:SUCCESS',
        };

        this.handler<SaveGroupUsecase>({
          container,
          usecaseId: 'SaveGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );

    router.get(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`,
      validator('GetGroupByIdUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: MessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,

          successCode: {
            code: 'GET-GROUP:SUCCESS',
            message: 'The group was found succesfully',
          },
        };

        this.handler<GetGroupByIdUsecase>({
          container,
          usecaseId: 'GetGroupByIdUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );

    router.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`,
      validator('UpdateGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;
        const body = request.body;
        body.id = request.params.groupId;

        const config: MessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,

          successCode: {
            code: 'UPDATED-GROUP:SUCCESS',
            message: 'The group was upadted succesfully',
          },
        };

        this.handler<UpdateGroupUsecase>({
          container,
          usecaseId: 'UpdateGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: {
            ...params,
            group: body,
          },
        });
      }
    );
    router.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/udpate-teams`,
      validator('UpdateTeamsInGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;
        const body = request.body;
        const data = {
          ...params,
          teamIds: body.teamIds,
        };
        body.id = request.params.groupId;

        const config: MessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,

          successCode: {
            code: 'UPDATED-TEAMS-IN-GROUP:SUCCESS',
            message: 'The teams was updated into the group succesfully',
          },
        };

        this.handler<UpdateTeamsInGroupUsecase>({
          container,
          usecaseId: 'UpdateTeamsInGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: data,
        });
      }
    );

    router.get(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/matches`, (request: Request, response: Response) => {
      const params = request.params;

      const config: MessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'MATCHES-FOUND:SUCCESS',
      };

      this.handler<GetGroupMatchesUsecase>({
        container,
        usecaseId: 'GetGroupMatchesUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          ...params,
          states: request.query.states,
        },
      });
    });
    router.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId`,
      validator('DeleteFixtureStageUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: MessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: 'FIXTURE-STAGE-DELETED:SUCCESS',
        };

        this.handler<DeleteFixtureStageUsecase>({
          container,
          usecaseId: 'DeleteFixtureStageUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );

    router.get(`/:id/registered-teams`, (request: Request, response: Response) => {
      const params = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-GROUP:SUCCESS',
          message: 'The registered teams was returned',
        },
      };

      this.handler<GetRegisteredTeamsByTournamentIdUsecase>({
        container,
        usecaseId: 'GetRegisteredTeamsByTournamentIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.delete(
      `/:tournamentId/registered-teams/:registeredTeamId`,
      validator('DeleteRegisteredTeamByIdUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: MessagesConfiguration = {
          identifier: this.identifier,
          successCode: {
            code: 'REGISTERED-TEAM-DELETED:SUCCESS',
            message: 'The registered teams was returned',
          },
        };

        this.handler<DeleteRegisteredTeamByIdUsecase>({
          container,
          usecaseId: 'DeleteRegisteredTeamByIdUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );
    router.patch(
      `/:tournamentId/registered-team/:registeredTeamId/modify-status`,
      validator('ModifyRegisteredTeamStatusUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const status = request.body;

        const config: MessagesConfiguration = {
          exceptions: {
            NotAllowedStatusModificationError: 'MODIFY-REGISTERED-TEAM-STATUS:ERROR',
            RegisteredTeamDoesNotExist: 'REGISTERED-TEAM-DOES-NOT-EXISTS:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'MODIFY-REGISTERED-TEAM-STATUS:ERROR': '{message}',
            'REGISTERED-TEAM-DOES-NOT-EXISTS:ERROR': '{message}',
          },
          successCode: {
            code: 'MODIFY-REGISTERED-TEAM:SUCCESS',
            message: 'The registered teams was modified',
          },
        };

        this.handler<ModifyRegisteredTeamStatusUsecase>({
          container,
          usecaseId: 'ModifyRegisteredTeamStatusUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: { ...params, ...status },
        });
      }
    );

    router.get(
      `/:id`,
      // validator('GetTournamentByIdUsecase'),
      (request: Request, response: Response) => {
        const id = request.params.id;

        const config: MessagesConfiguration = {
          exceptions: {
            TournamentDoesNotExistError: 'GET:ERROR',
          },
          identifier: this.identifier,

          successCode: 'GET:SUCCESS',
          extraData: {
            name: id,
          },
        };

        this.handler<GetTournamentByIdUsecase>({
          container,
          usecaseId: 'GetTournamentByIdUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: id,
        });
      }
    );

    router.put(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/match`,
      validator('EditMatchInsideGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.body;
        const query = request.params;

        const config: MessagesConfiguration = {
          exceptions: {
            MatchDoesNotExist: 'MATCH-DOES-NOT-EXIST:ERROR',
            StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
            GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
            MatchIsCompletedError: 'MATCH-IS-ALREADY-COMPLETE:ERROR',
          },
          identifier: this.identifier,

          successCode: 'MATCH-EDITED:SUCCESS',
          extraData: {
            ...params,
          },
        };

        this.handler<EditMatchInsideGroupUsecase>({
          container,
          usecaseId: 'EditMatchInsideGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: {
            match: {
              ...params,
              date: params.date ? getDateFromSeconds(params.date) : undefined,
            },
            ...query,
          },
        });
      }
    );

    router.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/match`,
      validator('AddMatchToGroupInsideTournamentUsecase'),
      (request: Request, response: Response) => {
        const body = request.body;
        const params = request.params;

        const config: MessagesConfiguration = {
          exceptions: {
            MatchWasAlreadyRegistered: 'MATCH-ALREADY-REGISTERED:ERROR',
            StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
            GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
          },
          identifier: this.identifier,

          successCode: 'MATCH-REGISTERED:SUCCESS',
          extraData: {
            ...body,
            ...params,
          },
        };

        this.handler<AddMatchToGroupInsideTournamentUsecase>({
          container,
          usecaseId: 'AddMatchToGroupInsideTournamentUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: { ...body, ...params },
        });
      }
    );
    router.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/complete-matches`,
      validator('AddMatchToGroupInsideTournamentUsecase'),
      (request: Request, response: Response) => {
        const body = request.body;
        const params = request.params;

        const config: MessagesConfiguration = {
          exceptions: {
            MatchWasAlreadyRegistered: 'MATCH-ALREADY-REGISTERED:ERROR',
            StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
            GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
          },
          identifier: this.identifier,

          successCode: 'MATCH-REGISTERED:SUCCESS',
          extraData: {
            ...body,
            ...params,
          },
        };

        this.handler<GetNewMatchesToAddInGroupUsecase>({
          container,
          usecaseId: 'GetNewMatchesToAddInGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: { ...body, ...params },
        });
      }
    );

    router.put(`/add-teams-into-group`, validator('AddTeamsToGroupInsideTournamentUsecase'), (request: Request, response: Response) => {
      const params = request.body;

      const config: MessagesConfiguration = {
        exceptions: {
          [ThereAreTeamRegisteredPreviuslyError.id]: 'TEAM-IS-ALREADY-IN-THE-GROUP:ERROR',
          [TeamAreRegisteredInOtherGroupError.id]: 'TEAM-IS-ALREADY-IN-OTHER-GROUP:ERROR',
          [TeamAreNotRegisteredError.id]: 'TEAM-ARE-NOT-REGISTERED-IN-TOURNAMENT:ERROR',
        },
        identifier: this.identifier,

        successCode: 'TEAM-REGISTERED-INTO-GROUP:SUCCESS',
        extraData: {
          ...params,
        },
      };

      this.handler<AddTeamsToGroupInsideTournamentUsecase>({
        container,
        usecaseId: 'AddTeamsToGroupInsideTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.put(`/:tournamentId/node-match/:nodeMatchId`, (request: Request, response: Response) => {
      const params = {
        ...request.body,
        nodeMatch: {
          ...request.body.nodeMatch,
          match: {
            ...request.body.nodeMatch.match,
            date: request.body.nodeMatch.match.date ? getDateFromSeconds(request.body.nodeMatch.match.date) : undefined,
          },
        },
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'EDITED-MAIN-DRAW:SUCCESS',
      };

      this.handler<EditNodeMatchUsecase>({
        container,
        usecaseId: 'EditNodeMatchUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });
    router.post(`/:tournamentId/node-match`, (request: Request, response: Response) => {
      const params = {
        tournamentId: request.body.tournamentId,
        key: request.body.key,
        level: request.body.level,
        teamAId: request.body.match.teamAId,
        teamBId: request.body.match.teamBId,
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'NODE-MATCH-CREATED:SUCCESS',
      };

      this.handler<CreateNodeMatchUsecase>({
        container,
        usecaseId: 'CreateNodeMatchUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: params,
      });
    });

    router.get(`/:id/main-draw`, (request: Request, response: Response) => {
      const tournamentId = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handler<GetMainDrawNodeMatchesoverviewUsecase>({
        container,
        usecaseId: 'GetMainDrawNodeMatchesoverviewUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: { tournamentId },
      });
    });

    router.get(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/positions-table`,
      validator('GetPositionsTableByGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: MessagesConfiguration = {
          identifier: this.identifier,
          successCode: {
            code: 'GET-MAIN-DRAW:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handler<GetPositionsTableByGroupUsecase>({
          container,
          usecaseId: 'GetPositionsTableByGroupUsecase',
          response,
          messageConfiguration: config,
          usecaseParam: params,
        });
      }
    );

    router.post(`/`, validator('CreateTournamentUsecase'), (request: Request, response: Response) => {
      const tournament = request.body;

      tournament['startsDate'] = new Date(Date.parse(tournament['startsDate']));

      const config: MessagesConfiguration = {
        exceptions: {
          Base64Error: 'IMAGE:ERROR',
          SizeError: 'IMAGE:ERROR',
          SizePropertyError: 'IMAGE-SIZE-PROPERTY:ERROR',
          EmptyAttributeError: 'EMPTY-ATTRIBUTE:ERROR',
          TournamentLayoutNotFoundError: 'TOURNAMENT-LAYOUT-NOT-FOUND:ERROR',
          OrganizationNotFoundError: 'ORGANIZATION-NOT-FOUND:ERROR',
          TournamentAlreadyExistsError: 'TOURNAMENT-ALREADY-EXISTS:ERROR',
        },
        identifier: this.identifier,

        successCode: 'TOURNAMENT-CREATED:SUCCESS',
      };

      this.handler<CreateTournamentUsecase>({
        container,
        usecaseId: 'CreateTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: tournament,
      });
    });
    router.get(`/:id/register-qr`, validator('GetRegisterTeamQRUsecase'), (request: Request, response: Response) => {
      const tournament = request.params.id;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'TOURNAMENT-CREATED:SUCCESS',
      };

      this.handler<GetRegisterTeamQRUsecase>({
        container,
        usecaseId: 'GetRegisterTeamQRUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: tournament,
      });
    });
    router.get(`/:tournamentId/cards-report`, (request: Request, response: Response) => {
      const tournament = request.params.tournamentId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'CARD-REPORT:SUCCESS',
      };

      this.handler<GetCardsReportByTournamentUsecase>({
        container,
        usecaseId: 'GetCardsReportByTournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: tournament,
      });
    });
    router.get(`/tournaments-that-i-participate/:teamId`, (request: Request, response: Response) => {
      const teamId = request.params.teamId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'GET-TOURNAMENTS-WHERE-I-PARTICIPATE:SUCCESS',
      };

      this.handler<GetRunningTournamentsWhereExistsTeamIdUsecase>({
        container,
        usecaseId: 'GetRunningTournamentsWhereExistsTeamIdUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: {
          teamId,
        },
      });
    });

    router.patch(`/:id/modify-status`, validator('ModifyTournamentStatusUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: MessagesConfiguration = {
        exceptions: {
          NotAllowedStatusModificationError: 'MODIFY-STATUS:ERROR',
        },
        identifier: this.identifier,
        successCode: 'MODIFY-STATUS:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handler<ModifyTournamentStatusUsecase>({
        container,
        usecaseId: 'ModifyTournamentStatusUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });
    router.patch(`/:id/modify-financial-status`, (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: MessagesConfiguration = {
        exceptions: {
          NotAllowedStatusModificationError: 'MODIFY-STATUS:ERROR',
        },
        identifier: this.identifier,
        successCode: 'MODIFY-FINANCIAL-STATUS:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handler<ModifyTournamentFinancialStatusUsecase>({
        container,
        usecaseId: 'ModifyTournamentFinancialStatusUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });
    router.patch(`/:id/modify-locations`, validator('ModifyTournamentLocationsUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'MODIFY-LOCATIONS:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handler<ModifyTournamentLocationsUsecase>({
        container,
        usecaseId: 'ModifyTournamentLocationsUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });
    router.patch(`/:id/modify-referees`, validator('ModifyTournamentRefereesUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        successCode: 'MODIFY-REFEREES:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handler<ModifyTournamentRefereesUsecase>({
        container,
        usecaseId: 'ModifyTournamentRefereesUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });
    router.post(`/:tournamentId/register-into-tournament`, (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.tournamentId,
      };

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          [RequiredDocsForTeamIncompleteError.id]: 'REQUIRED-DOCS-FOR-TEAM-INCOMPLETE:ERROR',
          [RequiredDocsForMembersIncompleteError.id]: 'REQUIRED-DOCS-FOR-MEMBERS-INCOMPLETE:ERROR',
          [RequiredDocsNoPresentError.id]: 'REQUIRED-DOCS-NO-PRESENT:ERROR',
          [TeamAlreadyRegisteredError.id]: 'TEAM-ALREADY-REGISTERED:ERROR',
          [DataIncompleteError.id]: 'DATA-INCOMPLETE:ERROR',
          [MemberIdsNotFoundError.id]: 'MEMBER-IDS-NOT-FOUND:ERROR',
        },
        successCode: 'REGISTRATION-DONE:SUCCESS',
      };

      this.handler<RegisterTeamIntoATournamentLinealUsecase>({
        container,
        usecaseId: 'RegisterTeamIntoATournamentLinealUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: data,
      });
    });
    router.post(`/register-members-into-tournament`, (request: Request, response: Response) => {
      const body = request.body;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          [TeamIsNotRegisteredError.id]: 'TEAM-IS-NOT-REGISTERED:ERROR',
          [RequiredDocsForMemberIncompleteError.id]: 'REQUIRED-DOCS-FOR-MEMBER-INCOMPLETE:ERROR',
          [DataIncompleteError.id]: 'DATA-INCOMPLETE:ERROR',
        },
        successCode: 'MEMBER-REGISTRATION-DONE:SUCCESS',
      };

      this.handler<RegisterMembersIntoATournamentUsecase>({
        container,
        usecaseId: 'RegisterMembersIntoATournamentUsecase',
        response,
        messageConfiguration: config,
        usecaseParam: body,
      });
    });

    // app.get(`/intergroup-match`, (request: Request, response: Response) => {
    //   const params = request.query;

    //   const config: MessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handler<GetIntergroupMatchUsecase>({
    //     container, usecaseId:
    //     'GetIntergroupMatchUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    // app.get(`/all-match-sheet`, (request: Request, response: Response) => {
    //   const config: MessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handler<GetAllMatchSheetsByTournamentUsecase>({
    //     container, usecaseId:
    //     'GetAllMatchSheetsByTournamentUsecase',
    //     response,
    //     config,
    //     undefined,
    //     undefined
    //   );
    // });

    // app.put(`/:id/invoices`, (request: Request, response: Response) => {
    //   const id = request.params.id;

    //   const config: MessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: 'GET:SUCCESS',
    //     extraData: {
    //       name: id,
    //     },
    //   };

    //   this.handler<CalculateTournamentInvoicesById>({
    //     container, usecaseId:
    //     'CalculateTournamentInvoicesById',
    //     response,
    //     config,
    //     undefined,
    //     id
    //   );
    // });

    // app.get(`/grouped-matches`, (request: Request, response: Response) => {
    //   const params = request.query;

    //   const config: MessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: 'GET:SUCCESS',
    //     extraData: {},
    //   };

    //   this.handler<GetGroupedMatchesByDateUsecase>({
    //     container, usecaseId:
    //     'GetGroupedMatchesByDateUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    // app.get(
    //   `/match-inside-group`,
    //   (request: Request, response: Response) => {
    //     const params = request.query;
    //     const config: MessagesConfiguration = {
    //       exceptions: {},
    //       identifier: this.identifier,
    //       errorCodes: {},
    //       successCode: {
    //         code: 'GET-MATCH:SUCCESS',
    //         message: 'The match was returned',
    //       },
    //     };

    //     this.handler<GetMatchInsideGroup>({
    //       container, usecaseId:
    //       'GetMatchInsideGroup',
    //       response,
    //       config,
    //       undefined,
    //       params
    //     );
    //   }
    // );

    // app.get(`/main-draw/node-match`, (request: Request, response: Response) => {
    //   const params = request.query;

    //   const config: MessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handler<GetMatchInMainDrawInsideTournamentUsecase>({
    //     container, usecaseId:
    //     'GetMatchInMainDrawInsideTournamentUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    // app.get(`/:id/position-tables`, (request: Request, response: Response) => {
    //   const id = request.params.id;

    //   const config: MessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handler<GetPositionsTableByStageUsecase>({
    //     container, usecaseId:
    //     'GetPositionsTableByStageUsecase',
    //     response,
    //     config,
    //     undefined,
    //     id
    //   );
    // });
  }
}
