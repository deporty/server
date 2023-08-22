import { Container } from '../../core/DI';
import { AddTeamsToTournamentUsecase } from '../domain/usecases/add-team-to-tournament/add-teams-to-tournament.usecase';
import { AddTeamsToGroupInsideTournamentUsecase } from '../domain/usecases/add-teams-to-group-inside-tournament/add-teams-to-group-inside-tournament.usecase';
import { CalculateTournamentCostByIdUsecase } from '../domain/usecases/calculate-tournament-cost-by-id/calculate-tournament-cost-by-id.usecase';
import { CalculateTournamentCostUsecase } from '../domain/usecases/calculate-tournament-cost/calculate-tournament-cost.usecase';
import { CreateMatchSheetUsecase } from '../domain/usecases/create-match-sheet/create-match-sheet.usecase';
import { CreateTournamentUsecase } from '../domain/usecases/create-tournament/create-tournament.usecase';
import { DeleteTournamentUsecase } from '../domain/usecases/delete-tournament/delete-tournament.usecase';
import { GetTournamentsByUniqueAttributesUsecase } from '../domain/usecases/exists-tournament/exists-tournament.usecase';
import { CreateFixtureStageUsecase } from '../domain/usecases/fixture-stages/create-fixture-stage/create-fixture-stage.usecase';
import { DeleteFixtureStageUsecase } from '../domain/usecases/fixture-stages/delete-fixture-stage/delete-fixture-stage.usecase';
import { GetFixtureStagesByTournamentUsecase } from '../domain/usecases/fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase';
import { GenerateMainDrawFromSchemaUsecase } from '../domain/usecases/generate-main-draw-from-schema/generate-main-draw-from-schema.usecase';
import { GetAllGroupMatchesByTournamentUsecase } from '../domain/usecases/get-all-group-matches-by-tournament/get-all-group-matches-by-tournament.usecase';
import { GetAllMatchesByDateUsecase } from '../domain/usecases/get-all-matches-by-date/get-all-matches-by-date.usecase';
import { GetAllMatchesGroupedByDateUsecase } from '../domain/usecases/get-all-matches-grouped-by-date/get-all-matches-grouped-by-date.usecase';
import { GetCurrentTournamentsUsecase } from '../domain/usecases/get-current-tournaments/get-current-tournaments.usecase';
import { GetMainDrawNodeMatchesoverviewUsecase } from '../domain/usecases/get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';
import { GetMarkersTableUsecase } from '../domain/usecases/get-markers-table/get-markers-table.usecase';
import { GetMatchesByRefereeIdUsecase } from '../domain/usecases/get-matches-by-referee-id/get-matches-by-referee-id.usecase';
import { GetPosibleTeamsToAddUsecase } from '../domain/usecases/get-posible-teams-to-add/get-posible-teams-to-add.usecase';
import { GetPositionsTableByGroupUsecase } from '../domain/usecases/get-positions-table-by-group.usecase';
import { GetPositionsTableUsecase } from '../domain/usecases/get-positions-table.usecase';
import { GetRegisterTeamQRUsecase } from '../domain/usecases/get-register-team-qr/get-register-team-qr.usecase';
import { GetTournamentByIdUsecase } from '../domain/usecases/get-tournament-by-id/get-tournament-by-id.usecase';
import { GetTournamentsByOrganizationAndTournamentLayoutUsecase } from '../domain/usecases/get-tournaments-by-organization/get-tournaments-by-organization.usecase';
import { GetTournamentsByRatioUsecase } from '../domain/usecases/get-tournaments-by-ratio/get-tournaments-by-ratio.usecase';
import { GetTournamentsUsecase } from '../domain/usecases/get-tournaments/get-tournaments.usecase';
import { AddMatchToGroupInsideTournamentUsecase } from '../domain/usecases/group-matches/add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase';
import { CompleteGroupMatchesUsecase } from '../domain/usecases/group-matches/complete-group-matches/complete-group-matches.usecase';
import { DeleteMatchByIdUsecase } from '../domain/usecases/group-matches/delete-match-by-id/delete-match-by-id.usecase';
import { DeleteMatchesWhereTeamIdExistsUsecase } from '../domain/usecases/group-matches/delete-matches-where-team-id-exists/delete-matches-where-team-id-exists.usecase';
import { EditMatchInsideGroupUsecase } from '../domain/usecases/group-matches/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase';
import { GetGroupMatchesUsecase } from '../domain/usecases/group-matches/get-group-matches/get-group-matches.usecase';
import { GetMatchByIdUsecase } from '../domain/usecases/group-matches/get-match-by-id/get-match-by-id.usecase';
import { GetMatchByTeamIdsUsecase } from '../domain/usecases/group-matches/get-match-by-team-ids/get-match-by-team-ids.usecase';
import { GetNewMatchesToAddInGroupUsecase } from '../domain/usecases/group-matches/get-new-matches-to-add-in-group/get-new-matches-to-add-in-group.usecase';
import { DeleteGroupByIdUsecase } from '../domain/usecases/groups/delete-group-by-id/delete-group-by-id.usecase';
import { DeleteTeamsInGroupUsecase } from '../domain/usecases/groups/delete-teams-in-group/delete-teams-in-group.usecase';
import { GetAnyMatchByTeamIdsUsecase } from '../domain/usecases/groups/get-any-match-by-team-ids/get-any-match-by-team-ids.usecase';
import { GetGroupByIdUsecase } from '../domain/usecases/groups/get-group-by-id/get-group-by-id.usecase';
import { GetGroupByLabelUsecase } from '../domain/usecases/groups/get-group-by-label/get-group-by-label.usecase';
import { GetGroupsByFixtureStageUsecase } from '../domain/usecases/groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase';
import { GetGroupsByTournamentIdUsecase } from '../domain/usecases/groups/get-groups-by-tournament-id/get-groups-by-tournament-id.usecase';
import { PublishAllMatchesByGroupUsecase } from '../domain/usecases/groups/publish-all-matches-by-group/publish-all-matches-by-group.usecase';
import { SaveGroupUsecase } from '../domain/usecases/groups/save-group/save-group.usecase';
import { UpdateGroupUsecase } from '../domain/usecases/groups/update-group/update-group.usecase';
import { UpdateTeamsInGroupUsecase } from '../domain/usecases/groups/update-teams-in-group/update-teams-in-group.usecase';
import { ImplementSchemaIntoTournamentUsecase } from '../domain/usecases/implement-schema-into-tournament/implement-schema-into-tournament.usecase';
import { AddIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/add-intergroup-match/add-intergroup-match.usecase';
import { DeleteIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/delete-intergroup-match/delete-intergroup-match.usecase';
import { EditIntergroupMatchUsecase } from '../domain/usecases/intergroup-matches/edit-intergroup-match/edit-intergroup-match.usecase';
import { GetIntergroupMatchByTeamIdsUsecase } from '../domain/usecases/intergroup-matches/get-intergroup-match-by-team-ids/get-intergroup-match-by-team-ids.usecase';
import { GetIntergroupMatchesUsecase } from '../domain/usecases/intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase';
import { IsASchemaValidForMainDrawUsecase } from '../domain/usecases/is-a-schema-valid-for-main-draw/is-a-schema-valid-for-main-draw.usecase';
import { CreateNodeMatchUsecase } from '../domain/usecases/main-draw/create-node-match/create-node-match.usecase';
import { ModifyTournamentLocationsUsecase } from '../domain/usecases/modify-tournament-locations/modify-tournament-locations.usecase';
import { ModifyTournamentRefereesUsecase } from '../domain/usecases/modify-tournament-referees/modify-tournament-referees.usecase';
import { ModifyTournamentStatusUsecase } from '../domain/usecases/modify-tournament-status/modify-tournament-status.usecase';
import { DeleteRegisteredTeamByIdUsecase } from '../domain/usecases/registered-team/delete-registered-team-by-id/delete-registered-team-by-id.usecase';
import { GetRegisteredTeamByIdUsecase } from '../domain/usecases/registered-team/get-registered-team-by-id/get-registered-team-by-id.usecase';
import { GetRegisteredTeamsByTournamentIdUsecase } from '../domain/usecases/registered-team/get-registered-teams-by-tournaments/get-registered-teams-by-tournaments.usecase';
import { ModifyRegisteredTeamStatusUsecase } from '../domain/usecases/registered-team/modify-registered-team-status/modify-registered-team-status.usecase';
import { UpdateRegisteredTeamByIdUsecase } from '../domain/usecases/registered-team/update-registered-team-by-id/update-registered-team-by-id.usecase';
import { UpdatePositionTableUsecase } from '../domain/usecases/update-positions-table/update-positions-table.usecase';
import { UpdateTournamentUsecase } from '../domain/usecases/update-tournament/update-tournament.usecase';
import { ContractModulesConfig } from './contract-modules-config';
import { MapperModulesConfig } from './mappers-modules-config';

export class TournamentsModulesConfig {
  static config(container: Container) {
    MapperModulesConfig.config(container);
    ContractModulesConfig.config(container);

    container.add({
      id: 'GetRegisteredTeamsByTournamentIdUsecase',
      kind: GetRegisteredTeamsByTournamentIdUsecase,
      dependencies: ['RegisteredTeamsContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'DeleteRegisteredTeamByIdUsecase',
      kind: DeleteRegisteredTeamByIdUsecase,
      dependencies: ['RegisteredTeamsContract'],
      strategy: 'singleton',
    });
    (function matches() {
      container.add({
        id: 'GetMatchByIdUsecase',
        kind: GetMatchByIdUsecase,
        dependencies: ['MatchContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'DeleteMatchByIdUsecase',
        kind: DeleteMatchByIdUsecase,
        dependencies: ['MatchContract', 'GetMatchByIdUsecase'],
        strategy: 'singleton',
      });

      container.add({
        id: 'GetGroupMatchesUsecase',
        kind: GetGroupMatchesUsecase,
        dependencies: ['MatchContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'GetMatchesByRefereeIdUsecase',
        kind: GetMatchesByRefereeIdUsecase,
        dependencies: ['MatchesByRefereeIdContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'DeleteMatchesWhereTeamIdExistsUsecase',
        kind: DeleteMatchesWhereTeamIdExistsUsecase,
        dependencies: ['GetGroupMatchesUsecase', 'DeleteMatchByIdUsecase'],
        strategy: 'singleton',
      });
    })();
    (function groups() {
      container.add({
        id: 'GetGroupByIdUsecase',
        kind: GetGroupByIdUsecase,
        dependencies: ['GroupContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'GetGroupsByFixtureStageUsecase',
        kind: GetGroupsByFixtureStageUsecase,
        dependencies: ['GroupContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'DeleteGroupByIdUsecase',
        kind: DeleteGroupByIdUsecase,
        dependencies: ['GetGroupByIdUsecase', 'GroupContract'],
        strategy: 'singleton',
      });
      container.add({
        id: 'GetGroupByLabelUsecase',
        kind: GetGroupByLabelUsecase,
        dependencies: ['GroupContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'SaveGroupUsecase',
        kind: SaveGroupUsecase,
        dependencies: ['GetGroupByLabelUsecase', 'GroupContract'],
        strategy: 'singleton',
      });
      container.add({
        id: 'UpdateGroupUsecase',
        kind: UpdateGroupUsecase,
        dependencies: ['GetGroupByIdUsecase', 'GroupContract'],
        strategy: 'singleton',
      });
      container.add({
        id: 'UpdateTeamsInGroupUsecase',
        kind: UpdateTeamsInGroupUsecase,
        dependencies: ['GetGroupByIdUsecase', 'TeamContract', 'GroupContract'],
        strategy: 'singleton',
      });

      container.add({
        id: 'DeleteTeamsInGroupUsecase',
        kind: DeleteTeamsInGroupUsecase,
        dependencies: ['GetGroupByIdUsecase', 'UpdateGroupUsecase', 'DeleteMatchesWhereTeamIdExistsUsecase'],
        strategy: 'singleton',
      });

      container.add({
        id: 'GetNewMatchesToAddInGroupUsecase',
        kind: GetNewMatchesToAddInGroupUsecase,
        dependencies: ['GetGroupByIdUsecase', 'GetGroupMatchesUsecase'],
        strategy: 'singleton',
      });
      container.add({
        id: 'CompleteGroupMatchesUsecase',
        kind: CompleteGroupMatchesUsecase,
        dependencies: ['GetNewMatchesToAddInGroupUsecase', 'AddMatchToGroupInsideTournamentUsecase'],
        strategy: 'singleton',
      });

      container.add({
        id: 'AddTeamsToGroupInsideTournamentUsecase',
        kind: AddTeamsToGroupInsideTournamentUsecase,
        dependencies: [
          'GetGroupsByFixtureStageUsecase',
          'GetRegisteredTeamsByTournamentIdUsecase',
          'GroupContract',
          'CompleteGroupMatchesUsecase',
        ],
        strategy: 'singleton',
      });
    })();

    container.add({
      id: 'GetTournamentByIdUsecase',
      kind: GetTournamentByIdUsecase,
      dependencies: ['TournamentContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetFixtureStagesByTournamentUsecase',
      kind: GetFixtureStagesByTournamentUsecase,
      dependencies: ['FixtureStageContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'DeleteFixtureStageUsecase',
      kind: DeleteFixtureStageUsecase,
      dependencies: ['FixtureStageContract', 'GetGroupsByFixtureStageUsecase', 'DeleteGroupByIdUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetGroupsByTournamentIdUsecase',
      kind: GetGroupsByTournamentIdUsecase,
      dependencies: ['GetGroupsByFixtureStageUsecase', 'GetFixtureStagesByTournamentUsecase'],
      strategy: 'singleton',
    });

    container.add({
      id: 'CreateFixtureStageUsecase',
      kind: CreateFixtureStageUsecase,
      dependencies: ['FixtureStageContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetAllGroupMatchesByTournamentUsecase',
      kind: GetAllGroupMatchesByTournamentUsecase,
      dependencies: ['GetFixtureStagesByTournamentUsecase', 'GetGroupsByFixtureStageUsecase', 'GetGroupMatchesUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetAllMatchesByDateUsecase',
      kind: GetAllMatchesByDateUsecase,
      dependencies: ['TournamentContract', 'GetAllGroupMatchesByTournamentUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetMarkersTableUsecase',
      kind: GetMarkersTableUsecase,
      dependencies: ['GetAllGroupMatchesByTournamentUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetAllMatchesGroupedByDateUsecase',
      kind: GetAllMatchesGroupedByDateUsecase,
      dependencies: ['GetAllGroupMatchesByTournamentUsecase'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetTournamentsByUniqueAttributesUsecase',
      kind: GetTournamentsByUniqueAttributesUsecase,
      dependencies: ['TournamentContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'UpdateTournamentUsecase',
      kind: UpdateTournamentUsecase,
      dependencies: ['TournamentContract', 'GetTournamentsByUniqueAttributesUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'DeleteTournamentUsecase',
      kind: DeleteTournamentUsecase,
      dependencies: ['TournamentContract', 'GetTournamentByIdUsecase', 'UpdateTournamentUsecase', 'FileAdapter'],
      strategy: 'singleton',
    });

    // container.add({
    //   id: 'CreateFixtureByGroupUsecase',
    //   kind: CreateFixtureByGroupUsecase,
    //   dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
    //   strategy: 'singleton',
    // });

    container.add({
      id: 'GetPosibleTeamsToAddUsecase',
      kind: GetPosibleTeamsToAddUsecase,
      dependencies: ['TeamContract', 'RegisteredTeamsContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTournamentsUsecase',
      kind: GetTournamentsUsecase,
      dependencies: ['TournamentContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetCurrentTournamentsUsecase',
      kind: GetCurrentTournamentsUsecase,
      dependencies: ['TournamentContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTournamentsByRatioUsecase',
      kind: GetTournamentsByRatioUsecase,
      dependencies: ['TournamentContract', 'LocationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTournamentsByOrganizationAndTournamentLayoutUsecase',
      kind: GetTournamentsByOrganizationAndTournamentLayoutUsecase,
      dependencies: ['TournamentContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'AddMatchToGroupInsideTournamentUsecase',
      kind: AddMatchToGroupInsideTournamentUsecase,
      dependencies: ['MatchContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetMatchByTeamIdsUsecase',
      kind: GetMatchByTeamIdsUsecase,
      dependencies: ['MatchContract'],
      strategy: 'singleton',
    });

    // container.add({
    //   id: 'AddTeamsToGroupInsideTournamentUsecase',
    //   kind: AddTeamsToGroupInsideTournamentUsecase,
    //   dependencies: [
    //     'GetTeamByIdOverviewUsecase',
    //     'GetGroupOverviewInsideTournamentUsecase',
    //     'TournamentContract',
    //   ],
    //   strategy: 'singleton',
    // });

    container.add({
      id: 'GetIntergroupMatchByTeamIdsUsecase',
      kind: GetIntergroupMatchByTeamIdsUsecase,
      dependencies: ['IntergroupMatchContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetAnyMatchByTeamIdsUsecase',
      kind: GetAnyMatchByTeamIdsUsecase,
      dependencies: ['GetMatchByTeamIdsUsecase', 'GetIntergroupMatchByTeamIdsUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'UpdatePositionTableUsecase',
      kind: UpdatePositionTableUsecase,
      dependencies: ['GetAnyMatchByTeamIdsUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'EditMatchInsideGroupUsecase',
      kind: EditMatchInsideGroupUsecase,
      dependencies: [
        'MatchContract',
        'FileAdapter',
        'GetMatchByIdUsecase',
        'UpdatePositionTableUsecase',
        'GetGroupByIdUsecase',
        'UpdateGroupUsecase',
        'GetTournamentByIdUsecase',
        'OrganizationContract',
      ],
      strategy: 'singleton',
    });

    container.add({
      id: 'PublishAllMatchesByGroupUsecase',
      kind: PublishAllMatchesByGroupUsecase,
      dependencies: ['GetGroupMatchesUsecase', 'EditMatchInsideGroupUsecase'],
      strategy: 'singleton',
    });

    container.add({
      id: 'CalculateTournamentCostUsecase',
      kind: CalculateTournamentCostUsecase,
      strategy: 'singleton',
    });
    container.add({
      id: 'CalculateTournamentCostByIdUsecase',
      kind: CalculateTournamentCostByIdUsecase,
      dependencies: ['GetTournamentByIdUsecase', 'TournamentContract', 'CalculateTournamentCostUsecase'],
      strategy: 'singleton',
    });
    // container.add({
    //   id: 'CalculateTournamentInvoices',
    //   kind: CalculateTournamentInvoices,
    //   dependencies: ['UpdateTournamentUsecase'],
    //   strategy: 'singleton',
    // });
    // container.add({
    //   id: 'CalculateTournamentInvoicesById',
    //   kind: CalculateTournamentInvoicesById,
    //   dependencies: ['GetTournamentByIdUsecase', 'CalculateTournamentInvoices'],
    //   strategy: 'singleton',
    // });

    container.add({
      id: 'AddTeamsToTournamentUsecase',
      kind: AddTeamsToTournamentUsecase,
      dependencies: ['RegisteredTeamsContract', 'TeamContract'],
      strategy: 'singleton',
    });

    // container.add({
    //   id: 'GetGroupedMatchesByDateUsecase',
    //   kind: GetGroupedMatchesByDateUsecase,
    //   dependencies: ['TournamentContract'],
    //   strategy: 'singleton',
    // });

    container.add({
      id: 'GetMainDrawNodeMatchesoverviewUsecase',
      kind: GetMainDrawNodeMatchesoverviewUsecase,
      dependencies: ['NodeMatchContract'],
      strategy: 'singleton',
    });

    // container.add({
    //   id: 'GetMatchInsideGroup',
    //   kind: GetMatchInsideGroup,
    //   dependencies: ['TournamentContract'],
    //   strategy: 'singleton',
    // });

    // container.add({
    //   id: 'EditMatchInMainDrawInsideTournamentUsecase',
    //   kind: EditMatchInMainDrawInsideTournamentUsecase,
    //   dependencies: ['TournamentContract', 'FileAdapter'],
    //   strategy: 'singleton',
    // });
    // container.add({
    //   id: 'GetMatchInMainDrawInsideTournamentUsecase',
    //   kind: GetMatchInMainDrawInsideTournamentUsecase,
    //   dependencies: ['TournamentContract'],
    //   strategy: 'singleton',
    // });
    // container.add({
    //   id: 'GetFullMaindrawpMatchesUsecase',
    //   kind: GetFullMaindrawpMatchesUsecase,
    //   dependencies: [
    //     'GetMainDrawNodeMatchesoverviewUsecase',
    //     'GetMatchInMainDrawInsideTournamentUsecase',
    //   ],
    //   strategy: 'singleton',
    // });
    // container.add({
    //   id: 'GetIntergroupMatchUsecase',
    //   kind: GetIntergroupMatchUsecase,
    //   dependencies: ['TournamentContract'],
    //   strategy: 'singleton',
    // });
    container.add({
      id: 'GetIntergroupMatchesUsecase',
      kind: GetIntergroupMatchesUsecase,
      dependencies: ['IntergroupMatchContract'],
      strategy: 'singleton',
    });

    // container.add({
    //   id: 'GetFullIntergroupMatchesUsecase',
    //   kind: GetFullIntergroupMatchesUsecase,
    //   dependencies: [
    //     'GetIntergroupMatchesUsecase',
    //     'GetIntergroupMatchUsecase',
    //     'GetFixtureOverviewByTournamentUsecase',
    //   ],
    //   strategy: 'singleton',
    // });

    container.add({
      id: 'EditIntergroupMatchUsecase',
      kind: EditIntergroupMatchUsecase,
      dependencies: ['IntergroupMatchContract', 'FileAdapter'],
      strategy: 'singleton',
    });
    container.add({
      id: 'DeleteIntergroupMatchUsecase',
      kind: DeleteIntergroupMatchUsecase,
      dependencies: ['IntergroupMatchContract', 'FileAdapter'],
      strategy: 'singleton',
    });
    container.add({
      id: 'AddIntergroupMatchUsecase',
      kind: AddIntergroupMatchUsecase,
      dependencies: ['IntergroupMatchContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetPositionsTableUsecase',
      kind: GetPositionsTableUsecase,
      dependencies: [],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetPositionsTableByGroupUsecase',
      kind: GetPositionsTableByGroupUsecase,
      dependencies: ['GetGroupMatchesUsecase', 'GetPositionsTableUsecase', 'GetIntergroupMatchesUsecase', 'GetGroupByIdUsecase'],
      strategy: 'singleton',
    });

    // container.add({
    //   id: 'GetPositionsTableByStageUsecase',
    //   kind: GetPositionsTableByStageUsecase,
    //   dependencies: [
    //     'GetFixtureOverviewByTournamentUsecase',
    //     'GetRegisteredTeamsByTournamentIdUsecase',
    //     'GetIntergroupMatchesUsecase',
    //     'GetPositionsTableUsecase',
    //   ],
    //   strategy: 'singleton',
    // });
    container.add({
      id: 'CreateMatchSheetUsecase',
      kind: CreateMatchSheetUsecase,
      dependencies: ['FileAdapter', 'GetTournamentByIdUsecase', 'OrganizationContract', 'TeamContract'],
      strategy: 'singleton',
    });
    // container.add({
    //   id: 'GetAllMatchSheetsByTournamentUsecase',
    //   kind: GetAllMatchSheetsByTournamentUsecase,
    //   dependencies: [
    //     'GetTournamentsOverviewUsecase',
    //     'GetFixtureOverviewByTournamentUsecase',
    //     'GetGroupSpecificationInsideTournamentUsecase',
    //     'GetMatchInsideGroup',
    //     'CreateMatchSheetUsecase',
    //     'GetFullIntergroupMatchesUsecase',
    //     'GetFullMaindrawpMatchesUsecase'
    //   ],
    //   strategy: 'singleton',
    // });

    container.add({
      id: 'ImplementSchemaIntoTournamentUsecase',
      kind: ImplementSchemaIntoTournamentUsecase,
      dependencies: ['CreateFixtureStageUsecase', 'SaveGroupUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'CreateTournamentUsecase',
      kind: CreateTournamentUsecase,
      dependencies: [
        'TournamentContract',
        'OrganizationContract',
        'FileAdapter',
        'GetTournamentsByUniqueAttributesUsecase',
        'ImplementSchemaIntoTournamentUsecase',
      ],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetRegisterTeamQRUsecase',
      kind: GetRegisterTeamQRUsecase,
      strategy: 'singleton',
    });

    container.add({
      id: 'ModifyTournamentStatusUsecase',
      kind: ModifyTournamentStatusUsecase,
      dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'ModifyTournamentLocationsUsecase',
      kind: ModifyTournamentLocationsUsecase,
      dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'ModifyTournamentRefereesUsecase',
      kind: ModifyTournamentRefereesUsecase,
      dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetRegisteredTeamByIdUsecase',
      kind: GetRegisteredTeamByIdUsecase,
      dependencies: ['RegisteredTeamsContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'UpdateRegisteredTeamByIdUsecase',
      kind: UpdateRegisteredTeamByIdUsecase,
      dependencies: ['GetRegisteredTeamByIdUsecase', 'RegisteredTeamsContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'ModifyRegisteredTeamStatusUsecase',
      kind: ModifyRegisteredTeamStatusUsecase,
      dependencies: ['GetRegisteredTeamByIdUsecase', 'UpdateRegisteredTeamByIdUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'CreateNodeMatchUsecase',
      kind: CreateNodeMatchUsecase,
      dependencies: ['NodeMatchContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GenerateMainDrawFromSchemaUsecase',
      kind: GenerateMainDrawFromSchemaUsecase,
      dependencies: [
        'GetGroupsByTournamentIdUsecase',
        'GetTournamentByIdUsecase',
        'CreateNodeMatchUsecase',
        'GetMainDrawNodeMatchesoverviewUsecase',
      ],
      strategy: 'singleton',
    });
    container.add({
      id: 'IsASchemaValidForMainDrawUsecase',
      kind: IsASchemaValidForMainDrawUsecase,
      strategy: 'singleton',
    });
  }
}
