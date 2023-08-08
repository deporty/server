import { Express, Request, Response } from 'express';
import { Container } from '../../core/DI';
import { IMessagesConfiguration } from '../../core/controller/controller';
import { HttpController } from '../../core/controller/http-controller';
import { getDateFromSeconds } from '../../core/helpers';
import { IsAuthorizedUserMiddleware } from '../../core/middlewares/is-authorized-user.middleware';
import { AddTeamsToTournamentUsecase } from '../domain/usecases/add-team-to-tournament/add-teams-to-tournament.usecase';
import { AddTeamsToGroupInsideTournamentUsecase } from '../domain/usecases/add-teams-to-group-inside-tournament/add-teams-to-group-inside-tournament.usecase';
import { CalculateTournamentCostByIdUsecase } from '../domain/usecases/calculate-tournament-cost-by-id/calculate-tournament-cost-by-id.usecase';
import { CreateMatchSheetUsecase } from '../domain/usecases/create-match-sheet/create-match-sheet.usecase';
import { CreateTournamentUsecase } from '../domain/usecases/create-tournament/create-tournament.usecase';
import { DeleteTournamentUsecase } from '../domain/usecases/delete-tournament/delete-tournament.usecase';
import { CreateFixtureStageUsecase } from '../domain/usecases/fixture-stages/create-fixture-stage/create-fixture-stage.usecase';
import { DeleteFixtureStageUsecase } from '../domain/usecases/fixture-stages/delete-fixture-stage/delete-fixture-stage.usecase';
import { GetFixtureStagesByTournamentUsecase } from '../domain/usecases/fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase';
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
import { GetTournamentsUsecase } from '../domain/usecases/get-tournaments/get-tournaments.usecase';
import { AddMatchToGroupInsideTournamentUsecase } from '../domain/usecases/group-matches/add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase';
import { EditMatchInsideGroupUsecase } from '../domain/usecases/group-matches/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase';
import { GetGroupMatchesUsecase } from '../domain/usecases/group-matches/get-group-matches/get-group-matches.usecase';
import { GetNewMatchesToAddInGroupUsecase } from '../domain/usecases/group-matches/get-new-matches-to-add-in-group/get-new-matches-to-add-in-group.usecase';
import { DeleteGroupByIdUsecase } from '../domain/usecases/groups/delete-group-by-id/delete-group-by-id.usecase';
import { DeleteTeamsInGroupUsecase } from '../domain/usecases/groups/delete-teams-in-group/delete-teams-in-group.usecase';
import { GetGroupByIdUsecase } from '../domain/usecases/groups/get-group-by-id/get-group-by-id.usecase';
import { GetGroupsByFixtureStageUsecase } from '../domain/usecases/groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';
import { SaveGroupUsecase } from '../domain/usecases/groups/save-group/save-group.usecase';
import { UpdateGroupUsecase } from '../domain/usecases/groups/update-group/update-group.usecase';
import { UpdateTeamsInGroupUsecase } from '../domain/usecases/groups/update-teams-in-group/update-teams-in-group.usecase';
import { AddIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/add-intergroup-match/add-intergroup-match.usecase';
import { DeleteIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/delete-intergroup-match/delete-intergroup-match.usecase';
import { EditIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/edit-intergroup-match/edit-intergroup-match.usecase';
import { GetIntergroupMatchesUsecase } from '../domain/usecases/intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase';
import { ModifyTournamentLocationsUsecase } from '../domain/usecases/modify-tournament-locations/modify-tournament-locations.usecase';
import { ModifyTournamentRefereesUsecase } from '../domain/usecases/modify-tournament-referees/modify-tournament-referees.usecase';
import { ModifyTournamentStatusUsecase } from '../domain/usecases/modify-tournament-status/modify-tournament-status.usecase';
import { DeleteRegisteredTeamByIdUsecase } from '../domain/usecases/registered-team/delete-registered-team-by-id/delete-registered-team-by-id.usecase';
import { GetRegisteredTeamsByTournamentIdUsecase } from '../domain/usecases/registered-team/get-registered-teams-by-tournaments/get-registered-teams-by-tournaments.usecase';
import { ModifyRegisteredTeamStatusUsecase } from '../domain/usecases/registered-team/modify-registered-team-status/modify-registered-team-status.usecase';
import { JWT_SECRET } from './tournaments.constants';
import { MessagesConfiguration } from '../../core/controller/messages-configuration';
import { GenerateMainDrawFromSchemaUsecase } from '../domain/usecases/generate-main-draw-from-schema/generate-main-draw-from-schema.usecase';

export class TournamentController extends HttpController {
  static identifier = 'TOURNAMENT';

  constructor() {
    super();
  }

  static registerEntryPoints(app: Express, container: Container) {
    const authorizedUserMiddleware: IsAuthorizedUserMiddleware =
      container.getInstance<IsAuthorizedUserMiddleware>('IsAuthorizedUserMiddleware').instance;

    const validator = (resourceName: string) => authorizedUserMiddleware.getValidator(resourceName, JWT_SECRET);

    app.get(`/ready`, this.readyHandler as any);

    // app.get(`/intergroup-match`, (request: Request, response: Response) => {
    //   const params = request.query;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handlerController<GetIntergroupMatchUsecase, any>(
    //     container,
    //     'GetIntergroupMatchUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    app.put(`/match-sheet`, (request: Request, response: Response) => {
      const params = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handlerController<CreateMatchSheetUsecase, any>(container, 'CreateMatchSheetUsecase', response, config, undefined, params);
    });
    app.get(`/:tournamentId/grouped-matches`, (request: Request, response: Response) => {
      const params = request.params.tournamentId;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handlerController<GetAllMatchesGroupedByDateUsecase, any>(
        container,
        'GetAllMatchesGroupedByDateUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.put(`/:tournamentId/generate-main-draw`, (request: Request, response: Response) => {
      const params = request.params.tournamentId;

      const config: MessagesConfiguration = {
        identifier: this.identifier,
        exceptions: {
          SchemaNoSelectedError: 'SCHEMA-NO-SELECTED:ERROR',
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

    app.get(`/matches-by-referee-id/:refereeId`, (request: Request, response: Response) => {
      const params = request.params.refereeId;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MATCHES-BY-REFEREE-ID:SUCCESS',
          message: 'The main matches was returned',
        },
      };
      this.handlerController<GetMatchesByRefereeIdUsecase, any>(
        container,
        'GetMatchesByRefereeIdUsecase',
        response,
        config,
        undefined,
        params
      );
    });
    // app.get(`/all-match-sheet`, (request: Request, response: Response) => {
    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handlerController<GetAllMatchSheetsByTournamentUsecase, any>(
    //     container,
    //     'GetAllMatchSheetsByTournamentUsecase',
    //     response,
    //     config,
    //     undefined,
    //     undefined
    //   );
    // });

    app.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`,
      validator('AddIntergroupMatchUsecase'),
      (request: Request, response: Response) => {
        const params = request.body;

        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'GET-MAIN-DRAW:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handlerController<AddIntergroupMatchUsecase, any>(container, 'AddIntergroupMatchUsecase', response, config, undefined, params);
      }
    );

    app.get(`/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`, (request: Request, response: Response) => {
      const params = request.params;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handlerController<GetIntergroupMatchesUsecase, any>(container, 'GetIntergroupMatchesUsecase', response, config, undefined, {
        ...params,
        states: request.query.states,
      });
    });
    app.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match/:intergroupMatchId`,
      validator('DeleteIntergroupMatchUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'GET-MAIN-DRAW:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handlerController<DeleteIntergroupMatchUsecase, any>(
          container,
          'DeleteIntergroupMatchUsecase',
          response,
          config,
          undefined,
          params
        );
      }
    );
    app.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/intergroup-match`,
      validator('EditIntergroupMatchUsecase'),

      (request: Request, response: Response) => {
        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'EDITED-INTERGROUP-MATCH:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handlerController<EditIntergroupMatchUsecase, any>(container, 'EditIntergroupMatchUsecase', response, config, undefined, {
          ...request.params,
          intergroupMatch: {
            ...request.body,
            match: {
              ...request.body.match,
              date: request.body.match.date ? getDateFromSeconds(request.body.match.date) : undefined,
            },
          },
        });
      }
    );

    app.get(`/markers-table/:id`, (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handlerController<GetMarkersTableUsecase, any>(container, 'GetMarkersTableUsecase', response, config, undefined, id);
    });
    app.get(`/by-position`, validator('GetTournamentsByRatioUsecase'), (request: Request, response: Response) => {
      const params = request.query;

      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handlerController<GetTournamentsByRatioUsecase, any>(container, 'GetTournamentsByRatioUsecase', response, config, undefined, {
        origin: {
          latitude: parseFloat(params.latitude as string),
          longitude: parseFloat(params.longitude as string),
        },
        ratio: parseFloat(params.ratio as string),
      });
    });

    app.put(`/:id/cost`, validator('CalculateTournamentCostByIdUsecase'), (request: Request, response: Response) => {
      const id = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {
          name: id,
        },
      };

      this.handlerController<CalculateTournamentCostByIdUsecase, any>(
        container,
        'CalculateTournamentCostByIdUsecase',
        response,
        config,
        undefined,
        id
      );
    });

    // app.put(`/:id/invoices`, (request: Request, response: Response) => {
    //   const id = request.params.id;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: 'GET:SUCCESS',
    //     extraData: {
    //       name: id,
    //     },
    //   };

    //   this.handlerController<CalculateTournamentInvoicesById, any>(
    //     container,
    //     'CalculateTournamentInvoicesById',
    //     response,
    //     config,
    //     undefined,
    //     id
    //   );
    // });

    // app.put(`/fixture-group`, (request: Request, response: Response) => {
    //   const params = request.body;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: 'FIXTURE-GROUP:SUCCESS',
    //     extraData: {
    //       ...params,
    //     },
    //   };

    //   this.handlerController<GetMarkersTableUsecase, any>(
    //     container,
    //     'CreateFixtureByGroupUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    app.put(`/add-team`, validator('AddTeamsToTournamentUsecase'), (request: Request, response: Response) => {
      const params = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {
          TeamWasAlreadyRegistered: 'TEAM-ALREADY-REGISTERED:ERROR',
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

      this.handlerController<AddTeamsToTournamentUsecase, any>(
        container,
        'AddTeamsToTournamentUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.get(`/available-teams-to-add/:id`, validator('GetPosibleTeamsToAddUsecase'), (request: Request, response: Response) => {
      const tournamentId = request.params.id;
      const query = request.query;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-AVAILABLE-TEAMS:SUCCESS',
          message: 'Available teams for the tournament with id "{id}"',
        },
        extraData: {
          id: tournamentId,
        },
      };

      this.handlerController<GetPosibleTeamsToAddUsecase, any>(container, 'GetPosibleTeamsToAddUsecase', response, config, undefined, {
        tournamentId,
        ...query,
      });
    });

    app.get(`/`, validator('GetTournamentsUsecase'), (request: Request, response: Response) => {
      const params = request.query;
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetTournamentsUsecase, any>(container, 'GetTournamentsUsecase', response, config, undefined, params);
    });
    app.get(`/current-tournaments`, (request: Request, response: Response) => {
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetCurrentTournamentsUsecase, any>(container, 'GetCurrentTournamentsUsecase', response, config, undefined);
    });
    app.get(`/get-matches-by-date/:date`, (request: Request, response: Response) => {
      const date = new Date(request.params.date);

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetAllMatchesByDateUsecase, any>(container, 'GetAllMatchesByDateUsecase', response, config, undefined, date);
    });

    app.get(`/by-organization-and-tournament-layout`, (request: Request, response: Response) => {
      const params: any = request.query;
      params['includeDraft'] = params['includeDraft'] == 'true';
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetTournamentsByOrganizationAndTournamentLayoutUsecase, any>(
        container,
        'GetTournamentsByOrganizationAndTournamentLayoutUsecase',
        response,
        config,
        undefined,
        params
      );
    });
    app.delete(`/:tournamentLayoutId`, validator('DeleteTournamentUsecase'), (request: Request, response: Response) => {
      const params = request.params.tournamentLayoutId;
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'DELETE:SUCCESS',
        extraData: {},
      };

      this.handlerController<DeleteTournamentUsecase, any>(container, 'DeleteTournamentUsecase', response, config, undefined, params);
    });

    // app.get(`/grouped-matches`, (request: Request, response: Response) => {
    //   const params = request.query;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: 'GET:SUCCESS',
    //     extraData: {},
    //   };

    //   this.handlerController<GetGroupedMatchesByDateUsecase, any>(
    //     container,
    //     'GetGroupedMatchesByDateUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    app.get(`/:id/fixture-stages`, (request: Request, response: Response) => {
      const id = request.params.id;
      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'GET:SUCCESS',
        extraData: {},
      };

      this.handlerController<GetFixtureStagesByTournamentUsecase, any>(
        container,
        'GetFixtureStagesByTournamentUsecase',
        response,
        config,
        undefined,
        id
      );
    });
    app.post(`/:id/fixture-stage`, validator('CreateFixtureStageUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const config: IMessagesConfiguration = {
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

      this.handlerController<CreateFixtureStageUsecase, any>(container, 'CreateFixtureStageUsecase', response, config, undefined, body);
    });

    // app.get(
    //   `/match-inside-group`,
    //   (request: Request, response: Response) => {
    //     const params = request.query;
    //     const config: IMessagesConfiguration = {
    //       exceptions: {},
    //       identifier: this.identifier,
    //       errorCodes: {},
    //       successCode: {
    //         code: 'GET-MATCH:SUCCESS',
    //         message: 'The match was returned',
    //       },
    //     };

    //     this.handlerController<GetMatchInsideGroup, any>(
    //       container,
    //       'GetMatchInsideGroup',
    //       response,
    //       config,
    //       undefined,
    //       params
    //     );
    //   }
    // );

    app.get(`/:tournamentId/fixture-stage/:fixtureStageId/groups`, (request: Request, response: Response) => {
      const params = request.params;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {
          'GROUP-NOT-FOUNDED:ERROR': '{message}',
        },
        successCode: 'GET-GROUPS-IN-FIXTURE-STAGES:SUCCESS',
      };

      this.handlerController<GetGroupsByFixtureStageUsecase, any>(
        container,
        'GetGroupsByFixtureStageUsecase',
        response,
        config,
        undefined,
        params
      );
    });

    app.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`,
      validator('DeleteGroupByIdUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-NOT-FOUND:ERROR': '{message}',
          },
          successCode: 'GROUP-DELETED:SUCCESS',
        };

        this.handlerController<DeleteGroupByIdUsecase, any>(container, 'DeleteGroupByIdUsecase', response, config, undefined, params);
      }
    );
    app.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/teams`,
      validator('DeleteTeamsInGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;
        const teamIds = request.body;
        params.teamIds = teamIds;

        const config: IMessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-NOT-FOUND:ERROR': '{message}',
          },
          successCode: 'TEAMS-DELETED-FROM-GROUP:SUCCESS',
        };

        this.handlerController<DeleteTeamsInGroupUsecase, any>(container, 'DeleteTeamsInGroupUsecase', response, config, undefined, params);
      }
    );

    app.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/group`,
      validator('SaveGroupUsecase'),
      (request: Request, response: Response) => {
        const params = { ...request.params, group: request.body };
        const config: IMessagesConfiguration = {
          exceptions: {
            GroupAlreadyExistsError: 'GROUP-ALREADY-EXISTS:ERROR',
            LabelMustBeProvidedError: 'LABEL-NOT-PROVIDED:ERROR',
            OrderMustBeProvidedError: 'ORDER-NOT-PROVIDED:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-ALREADY-EXISTS:ERROR': '{message}',
            'ORDER-NOT-PROVIDED:ERROR': '{message}',
            'LABEL-NOT-PROVIDED:ERROR': '{message}',
          },
          successCode: 'GROUP-SAVED:SUCCESS',
        };

        this.handlerController<SaveGroupUsecase, any>(container, 'SaveGroupUsecase', response, config, undefined, params);
      }
    );

    app.get(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`,
      validator('GetGroupByIdUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-NOT-FOUND:ERROR': '{message}',
          },
          successCode: {
            code: 'GET-GROUP:SUCCESS',
            message: 'The group was found succesfully',
          },
        };

        this.handlerController<GetGroupByIdUsecase, any>(container, 'GetGroupByIdUsecase', response, config, undefined, params);
      }
    );

    app.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId`,
      validator('UpdateGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;
        const body = request.body;
        body.id = request.params.groupId;

        const config: IMessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-NOT-FOUND:ERROR': '{message}',
          },
          successCode: {
            code: 'UPDATED-GROUP:SUCCESS',
            message: 'The group was upadted succesfully',
          },
        };

        this.handlerController<UpdateGroupUsecase, any>(container, 'UpdateGroupUsecase', response, config, undefined, {
          ...params,
          group: body,
        });
      }
    );
    app.patch(
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

        const config: IMessagesConfiguration = {
          exceptions: {
            GroupDoesNotExist: 'GROUP-NOT-FOUND:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GROUP-NOT-FOUND:ERROR': '{message}',
          },
          successCode: {
            code: 'UPDATED-TEAMS-IN-GROUP:SUCCESS',
            message: 'The teams was updated into the group succesfully',
          },
        };

        this.handlerController<UpdateTeamsInGroupUsecase, any>(container, 'UpdateTeamsInGroupUsecase', response, config, undefined, data);
      }
    );

    app.get(`/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/matches`, (request: Request, response: Response) => {
      const params = request.params;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'MATCHES-FOUND:SUCCESS',
      };

      this.handlerController<GetGroupMatchesUsecase, any>(container, 'GetGroupMatchesUsecase', response, config, undefined, {
        ...params,
        states: request.query.states,
      });
    });
    app.delete(
      `/:tournamentId/fixture-stage/:fixtureStageId`,
      validator('DeleteFixtureStageUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: 'FIXTURE-STAGE-DELETED:SUCCESS',
        };

        this.handlerController<DeleteFixtureStageUsecase, any>(container, 'DeleteFixtureStageUsecase', response, config, undefined, params);
      }
    );

    app.get(`/:id/registered-teams`, (request: Request, response: Response) => {
      const params = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-GROUP:SUCCESS',
          message: 'The registered teams was returned',
        },
      };

      this.handlerController<GetRegisteredTeamsByTournamentIdUsecase, any>(
        container,
        'GetRegisteredTeamsByTournamentIdUsecase',
        response,
        config,
        undefined,
        params
      );
    });
    app.delete(
      `/:tournamentId/registered-teams/:registeredTeamId`,
      validator('DeleteRegisteredTeamByIdUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'REGISTERED-TEAM-DELETED:SUCCESS',
            message: 'The registered teams was returned',
          },
        };

        this.handlerController<DeleteRegisteredTeamByIdUsecase, any>(
          container,
          'DeleteRegisteredTeamByIdUsecase',
          response,
          config,
          undefined,
          params
        );
      }
    );
    app.patch(
      `/:tournamentId/registered-team/:registeredTeamId/modify-status`,
      validator('ModifyRegisteredTeamStatusUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const status = request.body;

        const config: IMessagesConfiguration = {
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

        this.handlerController<ModifyRegisteredTeamStatusUsecase, any>(
          container,
          'ModifyRegisteredTeamStatusUsecase',
          response,
          config,
          undefined,
          { ...params, ...status }
        );
      }
    );

    app.get(
      `/:id`,
      // validator('GetTournamentByIdUsecase'),
      (request: Request, response: Response) => {
        const id = request.params.id;

        const config: IMessagesConfiguration = {
          exceptions: {
            TournamentDoesNotExistError: 'GET:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'GET:ERROR': '{message}',
          },
          successCode: 'GET:SUCCESS',
          extraData: {
            name: id,
          },
        };

        this.handlerController<GetTournamentByIdUsecase, any>(container, 'GetTournamentByIdUsecase', response, config, undefined, id);
      }
    );

    app.put(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/match`,
      validator('EditMatchInsideGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.body;
        const query = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            MatchDoesNotExist: 'MATCH-DOES-NOT-EXIST:ERROR',
            StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
            GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
            MatchIsCompletedError: 'MATCH-IS-ALREADY-COMPLETE:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'MATCH-DOES-NOT-EXIST:ERROR': '{message}',
            'STAGE-DOES-NOT-EXIST:ERROR': '{message}',
            'GROUP-DOES-NOT-EXIST:ERROR': '{message}',
            'MATCH-IS-ALREADY-COMPLETE:ERROR': '{message}',
          },
          successCode: 'MATCH-EDITED:SUCCESS',
          extraData: {
            ...params,
          },
        };

        this.handlerController<EditMatchInsideGroupUsecase, any>(container, 'EditMatchInsideGroupUsecase', response, config, undefined, {
          match: {
            ...params,
            date: params.date ? getDateFromSeconds(params.date) : undefined,
          },
          ...query,
        });
      }
    );

    app.post(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/match`,
      validator('AddMatchToGroupInsideTournamentUsecase'),
      (request: Request, response: Response) => {
        const body = request.body;
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            MatchWasAlreadyRegistered: 'MATCH-ALREADY-REGISTERED:ERROR',
            StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
            GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'MATCH-ALREADY-REGISTERED:ERROR': '{message}',
            'STAGE-DOES-NOT-EXIST:ERROR': '{message}',
            'GROUP-DOES-NOT-EXIST:ERROR': '{message}',
          },
          successCode: 'MATCH-REGISTERED:SUCCESS',
          extraData: {
            ...body,
            ...params,
          },
        };

        this.handlerController<AddMatchToGroupInsideTournamentUsecase, any>(
          container,
          'AddMatchToGroupInsideTournamentUsecase',
          response,
          config,
          undefined,
          { ...body, ...params }
        );
      }
    );
    app.patch(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/complete-matches`,
      validator('AddMatchToGroupInsideTournamentUsecase'),
      (request: Request, response: Response) => {
        const body = request.body;
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {
            MatchWasAlreadyRegistered: 'MATCH-ALREADY-REGISTERED:ERROR',
            StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
            GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
          },
          identifier: this.identifier,
          errorCodes: {
            'MATCH-ALREADY-REGISTERED:ERROR': '{message}',
            'STAGE-DOES-NOT-EXIST:ERROR': '{message}',
            'GROUP-DOES-NOT-EXIST:ERROR': '{message}',
          },
          successCode: 'MATCH-REGISTERED:SUCCESS',
          extraData: {
            ...body,
            ...params,
          },
        };

        this.handlerController<GetNewMatchesToAddInGroupUsecase, any>(
          container,
          'GetNewMatchesToAddInGroupUsecase',
          response,
          config,
          undefined,
          { ...body, ...params }
        );
      }
    );

    app.put(`/add-teams-into-group`, validator('AddTeamsToGroupInsideTournamentUsecase'), (request: Request, response: Response) => {
      const params = request.body;

      const config: IMessagesConfiguration = {
        exceptions: {
          ThereAreTeamRegisteredPreviuslyError: 'TEAM-IS-ALREADY-IN-THE-GROUP:ERROR',
          TeamAreRegisteredInOtherGroupError: 'TEAM-IS-ALREADY-IN-OTHER-GROUP:ERROR',
          TeamAreNotRegisteredError: 'TEAM-ARE-NOT-REGISTERED-IN-TOURNAMENT:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'TEAM-IS-ALREADY-IN-THE-GROUP:ERROR': '{message}',
          'TEAM-IS-ALREADY-IN-OTHER-GROUP:ERROR': '{message}',
          'TEAM-ARE-NOT-REGISTERED-IN-TOURNAMENT:ERROR': '{message}',
        },
        successCode: 'TEAM-REGISTERED-INTO-GROUP:SUCCESS',
        extraData: {
          ...params,
        },
      };

      this.handlerController<AddTeamsToGroupInsideTournamentUsecase, any>(
        container,
        'AddTeamsToGroupInsideTournamentUsecase',
        response,
        config,
        undefined,
        params
      );
    });
    // app.put(`/add-teams-into-group`, (request: Request, response: Response) => {
    //   const params = request.body;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {
    //       MatchWasAlreadyRegistered: 'MATCH-ALREADY-REGISTERED:ERROR',
    //       StageDoesNotExist: 'STAGE-DOES-NOT-EXIST:ERROR',
    //       GroupDoesNotExist: 'GROUP-DOES-NOT-EXIST:ERROR',
    //     },
    //     identifier: this.identifier,
    //     errorCodes: {
    //       'MATCH-ALREADY-REGISTERED:ERROR': '{message}',
    //       'STAGE-DOES-NOT-EXIST:ERROR': '{message}',
    //       'GROUP-DOES-NOT-EXIST:ERROR': '{message}',
    //     },
    //     successCode: 'TEAM-REGISTERED-INTO-GROUP:SUCCESS',
    //     extraData: {
    //       ...params,
    //     },
    //   };

    //   this.handlerController<AddTeamsToGroupInsideTournamentUsecase, any>(
    //     container,
    //     'AddTeamsToGroupInsideTournamentUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    // app.put(`/main-draw/node-match`, (request: Request, response: Response) => {
    //   const params = request.body;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handlerController<EditMatchInMainDrawInsideTournamentUsecase, any>(
    //     container,
    //     'EditMatchInMainDrawInsideTournamentUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    // app.get(`/main-draw/node-match`, (request: Request, response: Response) => {
    //   const params = request.query;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handlerController<GetMatchInMainDrawInsideTournamentUsecase, any>(
    //     container,
    //     'GetMatchInMainDrawInsideTournamentUsecase',
    //     response,
    //     config,
    //     undefined,
    //     params
    //   );
    // });

    app.get(`/:id/main-draw`, (request: Request, response: Response) => {
      const tournamentId = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: {
          code: 'GET-MAIN-DRAW:SUCCESS',
          message: 'The main draw was returned',
        },
      };

      this.handlerController<GetMainDrawNodeMatchesoverviewUsecase, any>(
        container,
        'GetMainDrawNodeMatchesoverviewUsecase',
        response,
        config,
        undefined,
        tournamentId
      );
    });

    app.get(
      `/:tournamentId/fixture-stage/:fixtureStageId/group/:groupId/positions-table`,
      validator('GetPositionsTableByGroupUsecase'),
      (request: Request, response: Response) => {
        const params = request.params;

        const config: IMessagesConfiguration = {
          exceptions: {},
          identifier: this.identifier,
          errorCodes: {},
          successCode: {
            code: 'GET-MAIN-DRAW:SUCCESS',
            message: 'The main draw was returned',
          },
        };

        this.handlerController<GetPositionsTableByGroupUsecase, any>(
          container,
          'GetPositionsTableByGroupUsecase',
          response,
          config,
          undefined,
          params
        );
      }
    );
    // app.get(`/:id/position-tables`, (request: Request, response: Response) => {
    //   const id = request.params.id;

    //   const config: IMessagesConfiguration = {
    //     exceptions: {},
    //     identifier: this.identifier,
    //     errorCodes: {},
    //     successCode: {
    //       code: 'GET-MAIN-DRAW:SUCCESS',
    //       message: 'The main draw was returned',
    //     },
    //   };

    //   this.handlerController<GetPositionsTableByStageUsecase, any>(
    //     container,
    //     'GetPositionsTableByStageUsecase',
    //     response,
    //     config,
    //     undefined,
    //     id
    //   );
    // });
    app.post(`/`, validator('CreateTournamentUsecase'), (request: Request, response: Response) => {
      const tournament = request.body;
      console.log('Llego ', tournament);

      const usecase = container.getInstance<any>('FixtureStagesConfigurationMapper').instance;
      console.log('Usecase::: ', usecase);
      tournament['startsDate'] = new Date(Date.parse(tournament['startsDate']));

      const config: IMessagesConfiguration = {
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
        errorCodes: {
          'IMAGE:ERROR': '{message}',
          'IMAGE-SIZE-PROPERTY:ERROR': '{message}',
          'EMPTY-ATTRIBUTE:ERROR': '{message}',
          'TOURNAMENT-LAYOUT-NOT-FOUND:ERROR': '{message}',
          'ORGANIZATION-NOT-FOUND:ERROR': '{message}',
          'TOURNAMENT-ALREADY-EXISTS:ERROR': '{message}',
        },
        successCode: 'TOURNAMENT-CREATED:SUCCESS',
      };

      this.handlerController<CreateTournamentUsecase, any>(container, 'CreateTournamentUsecase', response, config, undefined, tournament);
    });
    app.get(`/:id/register-qr`, validator('GetRegisterTeamQRUsecase'), (request: Request, response: Response) => {
      const tournament = request.params.id;

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'TOURNAMENT-CREATED:SUCCESS',
      };

      this.handlerController<GetRegisterTeamQRUsecase, any>(container, 'GetRegisterTeamQRUsecase', response, config, undefined, tournament);
    });

    app.patch(`/:id/modify-status`, validator('ModifyTournamentStatusUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: IMessagesConfiguration = {
        exceptions: {
          NotAllowedStatusModificationError: 'MODIFY-STATUS:ERROR',
        },
        identifier: this.identifier,
        errorCodes: {
          'MODIFY-STATUS:ERROR': '{message}',
        },
        successCode: 'MODIFY-STATUS:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handlerController<ModifyTournamentStatusUsecase, any>(
        container,
        'ModifyTournamentStatusUsecase',
        response,
        config,
        undefined,
        data
      );
    });
    app.patch(`/:id/modify-locations`, validator('ModifyTournamentLocationsUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'MODIFY-LOCATIONS:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handlerController<ModifyTournamentLocationsUsecase, any>(
        container,
        'ModifyTournamentLocationsUsecase',
        response,
        config,
        undefined,
        data
      );
    });
    app.patch(`/:id/modify-referees`, validator('ModifyTournamentRefereesUsecase'), (request: Request, response: Response) => {
      const body = request.body;
      const data = {
        ...body,
        tournamentId: request.params.id,
      };

      const config: IMessagesConfiguration = {
        exceptions: {},
        identifier: this.identifier,
        errorCodes: {},
        successCode: 'MODIFY-REFEREES:SUCCESS',
        extraData: {
          name: body,
        },
      };

      this.handlerController<ModifyTournamentRefereesUsecase, any>(
        container,
        'ModifyTournamentRefereesUsecase',
        response,
        config,
        undefined,
        data
      );
    });
  }
}
