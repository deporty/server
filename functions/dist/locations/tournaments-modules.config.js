"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsModulesConfig = void 0;
const tournament_contract_1 = require("./domain/tournament.contract");
// import { AddMatchToGroupInsideTournamentUsecase } from './domain/usecases/add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase';
// import { AddTeamToGroupInsideTournamentUsecase } from './domain/usecases/add-team-to-group-inside-tournament/add-team-to-group-inside-tournament.usecase';
// import { AddTeamsToTournamentUsecase } from './domain/usecases/add-team-to-tournament/add-teams-to-tournament.usecase';
// import { AddTeamsToGroupInsideTournamentUsecase } from './domain/usecases/add-teams-to-group-inside-tournament/add-teams-to-group-inside-tournament.usecase';
const calculate_tournament_cost_by_id_usecase_1 = require("./domain/usecases/calculate-tournament-cost-by-id/calculate-tournament-cost-by-id.usecase");
const calculate_tournament_cost_usecase_1 = require("./domain/usecases/calculate-tournament-cost/calculate-tournament-cost.usecase");
const get_fixture_stages_by_tournament_usecase_1 = require("./domain/usecases/get-fixture-stages-by-tournament.usecase");
const get_main_draw_node_matches_overview_usecase_1 = require("./domain/usecases/get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase");
const get_registered_teams_by_tournaments_usecase_1 = require("./domain/usecases/get-registered-teams-by-tournaments.usecase");
// import { CalculateTournamentInvoicesById } from './domain/usecases/calculate-tournament-invoices-by-id/calculate-tournament-invoices-by-id.usecase';
// import { CalculateTournamentInvoices } from './domain/usecases/calculate-tournament-invoices/calculate-tournament-invoices.usecase';
// import { CreateFixtureByGroupUsecase } from './domain/usecases/create-fixture-by-group/create-fixture-by-group.usecase';
// import { EditMatchToGroupInsideTournamentUsecase } from './domain/usecases/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase';
// import { GetMarkersTableUsecase } from './domain/usecases/get-markers-table/get-markers-table.usecase';
// import { GetPosibleTeamsToAddUsecase } from './domain/usecases/get-posible-teams-to-add/get-posible-teams-to-add.usecase';
const get_tournament_by_id_usecase_1 = require("./domain/usecases/get-tournament-by-id/get-tournament-by-id.usecase");
const get_tournaments_by_organization_usecase_1 = require("./domain/usecases/get-tournaments-by-organization/get-tournaments-by-organization.usecase");
// import { GetTournamentOverviewByIdUsecase } from './domain/usecases/get-tournament-overview-by-id/get-tournament-overview-by-id.usecase';
const get_tournaments_usecase_1 = require("./domain/usecases/get-tournaments/get-tournaments.usecase");
const delete_group_by_id_usecase_1 = require("./domain/usecases/groups/delete-group-by-id/delete-group-by-id.usecase");
const get_group_by_id_usecase_1 = require("./domain/usecases/groups/get-group-by-id/get-group-by-id.usecase");
const get_group_by_label_usecase_1 = require("./domain/usecases/groups/get-group-by-label/get-group-by-label.usecase");
const get_groups_by_fixture_stage_usecase_1 = require("./domain/usecases/groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase");
const save_group_usecase_1 = require("./domain/usecases/groups/save-group/save-group.usecase");
const update_teams_in_group_usecase_1 = require("./domain/usecases/groups/update-teams-in-group/update-teams-in-group.usecase");
const update_group_usecase_1 = require("./domain/usecases/groups/update-group/update-group.usecase");
const update_tournament_usecase_1 = require("./domain/usecases/update-tournament/update-tournament.usecase");
const fixture_stage_contract_1 = require("./infrastructure/contracts/fixture-stage.contract");
const group_contract_1 = require("./infrastructure/contracts/group.contract");
const node_match_contract_1 = require("./infrastructure/contracts/node-match.contract");
const registered_teams_contract_1 = require("./infrastructure/contracts/registered-teams.contract");
const financialStatements_mapper_1 = require("./infrastructure/mappers/financialStatements.mapper");
const fixture_stage_mapper_1 = require("./infrastructure/mappers/fixture-stage.mapper");
const group_mapper_1 = require("./infrastructure/mappers/group.mapper");
// import { GetMatchInsideGroup } from './domain/usecases/get-match-inside-group/get-match-inside-group.usecase';
// import { EditMatchInMainDrawInsideTournamentUsecase } from './domain/usecases/edit-match-in-main-draw-inside-tournament/edit-match-in-main-draw-inside-tournament.usecase';
// import { GetMatchInMainDrawInsideTournamentUsecase } from './domain/usecases/get-match-in-main-draw-inside-tournament/get-match-in-main-draw-inside-tournament.usecase';
// import { GetGroupOverviewInsideTournamentUsecase } from './domain/usecases/get-group-overview-inside-tournament/get-group-overview-inside-tournament.usecase';
const integroup_match_mapper_1 = require("./infrastructure/mappers/integroup-match.mapper");
// import { GetTournamentsOverviewUsecase } from './domain/usecases/get-tournaments-overview/get-tournaments-overview.usecase';
// import { GetFixtureOverviewByTournamentUsecase } from './domain/usecases/get-fixture-overview-by-tournament.usecase';
// import { GetGroupSpecificationInsideTournamentUsecase } from './domain/usecases/get-group-specification-inside-tournament/get-group-specification-inside-tournament.usecase';
// import { GetRegisteredTeamsByTournamentIdUsecase } from './domain/usecases/get-registered-teams-by-tournaments.usecase';
// import { GetGroupedMatchesByDateUsecase } from './domain/usecases/get-grouped-matches-by-date.usecase';
const location_mapper_1 = require("./infrastructure/mappers/location.mapper");
const match_mapper_1 = require("./infrastructure/mappers/match.mapper");
// import { GetMainDrawNodeMatchesoverviewusecase } from './domain/usecases/get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';
const node_match_mapper_1 = require("./infrastructure/mappers/node-match.mapper");
const player_form_mapper_1 = require("./infrastructure/mappers/player-form.mapper");
const playground_mapper_1 = require("./infrastructure/mappers/playground.mapper");
const registered_teams_mapper_1 = require("./infrastructure/mappers/registered-teams.mapper");
const score_mapper_1 = require("./infrastructure/mappers/score.mapper");
const stadistics_mapper_1 = require("./infrastructure/mappers/stadistics.mapper");
const tournament_mapper_1 = require("./infrastructure/mappers/tournament.mapper");
const fixture_stage_repository_1 = require("./infrastructure/repositories/fixture-stage.repository");
const group_repository_1 = require("./infrastructure/repositories/group.repository");
const node_match_repository_1 = require("./infrastructure/repositories/node-match.repository");
const registered_teams_repository_1 = require("./infrastructure/repositories/registered-teams.repository");
const tournament_repository_1 = require("./infrastructure/repositories/tournament.repository");
const get_group_matches_usecase_1 = require("./domain/usecases/group-matches/get-group-matches/get-group-matches.usecase");
const match_contract_1 = require("./infrastructure/contracts/match.contract");
const match_repository_1 = require("./infrastructure/repositories/match.repository");
// import { GetIntergroupMatchUsecase } from './domain/usecases/get-intergroup-match/get-intergroup-match.usecase';
// import { GetIntergroupMatchesUsecase } from './domain/usecases/get-intergroup-matches/get-intergroup-match.usecase';
// import { EditIntergroupMatchUsecase } from './domain/usecases/edit-intergroup-match/edit-intergroup-match.usecase';
// import { AddIntergroupMatchUsecase } from './domain/usecases/add-intergroup-match/add-intergroup-match.usecase';
// import { GetPositionsTableByStageUsecase } from './domain/usecases/get-positions-table-by-stage';
// import { GetPositionsTableUsecase } from './domain/usecases/get-positions-table';
// import { CreateMatchSheetUsecase } from './domain/usecases/create-match-sheet/create-match-sheet.usecase';
// import { GetAllMatchSheetsByTournamentUsecase } from './domain/usecases/get-all-match-sheets-by-tournament.usecase';
// import { GetFullIntergroupMatchesUsecase } from './domain/usecases/get-full-intergroup-matches/get-full-intergroup-matches.usecase';
// import { GetFullMaindrawpMatchesUsecase } from './domain/usecases/get-full-maindraw-matches/get-full-maindraw-matches.usecase';
class TournamentsModulesConfig {
    static config(container) {
        container.add({
            id: 'ScoreMapper',
            kind: score_mapper_1.ScoreMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'PlaygroundMapper',
            kind: playground_mapper_1.PlaygroundMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'LocationMapper',
            kind: location_mapper_1.LocationMapper,
            dependencies: ['PlaygroundMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'StadisticsMapper',
            kind: stadistics_mapper_1.StadisticsMapper,
            dependencies: ['PlayerMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'PlayerFormMapper',
            kind: player_form_mapper_1.PlayerFormMapper,
            dependencies: ['PlayerMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'MatchMapper',
            kind: match_mapper_1.MatchMapper,
            dependencies: ['ScoreMapper', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'IntergroupMatchMapper',
            kind: integroup_match_mapper_1.IntergroupMatchMapper,
            dependencies: ['MatchMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GroupMapper',
            kind: group_mapper_1.GroupMapper,
            dependencies: ['MatchMapper', 'TeamMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'NodeMatchMapper',
            kind: node_match_mapper_1.NodeMatchMapper,
            dependencies: ['MatchMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FixtureStageMapper',
            kind: fixture_stage_mapper_1.FixtureStageMapper,
            dependencies: ['GroupMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'RegisteredTeamMapper',
            kind: registered_teams_mapper_1.RegisteredTeamMapper,
            dependencies: ['MemberMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FinancialStatementsMapper',
            kind: financialStatements_mapper_1.FinancialStatementsMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'TournamentMapper',
            kind: tournament_mapper_1.TournamentMapper,
            dependencies: ['FinancialStatementsMapper', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GroupContract',
            kind: group_contract_1.GroupContract,
            override: group_repository_1.GroupRepository,
            dependencies: ['Firestore', 'GroupMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'TournamentContract',
            kind: tournament_contract_1.TournamentContract,
            override: tournament_repository_1.TournamentRepository,
            dependencies: ['DataSource', 'TournamentMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FixtureStageContract',
            kind: fixture_stage_contract_1.FixtureStageContract,
            override: fixture_stage_repository_1.FixtureStageRepository,
            dependencies: ['Firestore', 'FixtureStageMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'MatchContract',
            kind: match_contract_1.MatchContract,
            override: match_repository_1.MatchRepository,
            dependencies: ['Firestore', 'MatchMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'NodeMatchContract',
            kind: node_match_contract_1.NodeMatchContract,
            override: node_match_repository_1.NodeMatchRepository,
            dependencies: ['Firestore', 'NodeMatchMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'RegisteredTeamsContract',
            kind: registered_teams_contract_1.RegisteredTeamsContract,
            override: registered_teams_repository_1.RegisteredTeamsRepository,
            dependencies: ['Firestore', 'RegisteredTeamMapper'],
            strategy: 'singleton',
        });
        // container.add({
        //   id: 'GetMarkersTableUsecase',
        //   kind: GetMarkersTableUsecase,
        //   dependencies: [
        //     'GetFixtureOverviewByTournamentUsecase',
        //     'GetGroupSpecificationInsideTournamentUsecase',
        //     'GetIntergroupMatchesUsecase',
        //     'GetPlayerByIdUsecase',
        //     'GetTeamByIdOverviewUsecase',
        //     'TournamentContract',
        //   ],
        //   strategy: 'singleton',
        // });
        (function groups() {
            container.add({
                id: 'GetGroupByIdUsecase',
                kind: get_group_by_id_usecase_1.GetGroupByIdUsecase,
                dependencies: ['GroupContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'GetGroupsByFixtureStageUsecase',
                kind: get_groups_by_fixture_stage_usecase_1.GetGroupsByFixtureStageUsecase,
                dependencies: ['GroupContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'DeleteGroupByIdUsecase',
                kind: delete_group_by_id_usecase_1.DeleteGroupByIdUsecase,
                dependencies: ['GetGroupByIdUsecase', 'GroupContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'GetGroupByLabelUsecase',
                kind: get_group_by_label_usecase_1.GetGroupByLabelUsecase,
                dependencies: ['GroupContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'SaveGroupUsecase',
                kind: save_group_usecase_1.SaveGroupUsecase,
                dependencies: ['GetGroupByLabelUsecase', 'GroupContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'UpdateGroupUsecase',
                kind: update_group_usecase_1.UpdateGroupUsecase,
                dependencies: ['GetGroupByIdUsecase', 'GroupContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'UpdateTeamsInGroupUsecase',
                kind: update_teams_in_group_usecase_1.UpdateTeamsInGroupUsecase,
                dependencies: [
                    'GetGroupByIdUsecase',
                    'GetTeamByIdUsecase',
                    'GroupContract',
                ],
                strategy: 'singleton',
            });
            container.add({
                id: 'GetGroupMatchesUsecase',
                kind: get_group_matches_usecase_1.GetGroupMatchesUsecase,
                dependencies: [
                    'MatchContract',
                ],
                strategy: 'singleton',
            });
        })();
        container.add({
            id: 'GetTournamentByIdUsecase',
            kind: get_tournament_by_id_usecase_1.GetTournamentByIdUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetFixtureStagesByTournamentUsecase',
            kind: get_fixture_stages_by_tournament_usecase_1.GetFixtureStagesByTournamentUsecase,
            dependencies: ['FixtureStageContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'UpdateTournamentUsecase',
            kind: update_tournament_usecase_1.UpdateTournamentUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        // container.add({
        //   id: 'CreateFixtureByGroupUsecase',
        //   kind: CreateFixtureByGroupUsecase,
        //   dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
        //   strategy: 'singleton',
        // });
        // container.add({
        //   id: 'GetPosibleTeamsToAddUsecase',
        //   kind: GetPosibleTeamsToAddUsecase,
        //   dependencies: ['GetTeamsUsecase', 'GetTournamentByIdUsecase'],
        //   strategy: 'singleton',
        // });
        container.add({
            id: 'GetTournamentsUsecase',
            kind: get_tournaments_usecase_1.GetTournamentsUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsByOrganizationUsecase',
            kind: get_tournaments_by_organization_usecase_1.GetTournamentsByOrganizationUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        // container.add({
        //   id: 'AddMatchToGroupInsideTournamentUsecase',
        //   kind: AddMatchToGroupInsideTournamentUsecase,
        //   dependencies: ['TournamentContract'],
        //   strategy: 'singleton',
        // });
        // container.add({
        //   id: 'AddTeamToGroupInsideTournamentUsecase',
        //   kind: AddTeamToGroupInsideTournamentUsecase,
        //   dependencies: [
        //     'GetTournamentByIdUsecase',
        //     'GetTeamByIdUsecase',
        //     'UpdateTournamentUsecase',
        //   ],
        //   strategy: 'singleton',
        // });
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
        // container.add({
        //   id: 'EditMatchToGroupInsideTournamentUsecase',
        //   kind: EditMatchToGroupInsideTournamentUsecase,
        //   dependencies: ['TournamentContract', 'FileAdapter'],
        //   strategy: 'singleton',
        // });
        // container.add({
        //   id: 'GetTournamentOverviewByIdUsecase',
        //   kind: GetTournamentOverviewByIdUsecase,
        //   dependencies: ['TournamentContract'],
        //   strategy: 'singleton',
        // });
        container.add({
            id: 'CalculateTournamentCostUsecase',
            kind: calculate_tournament_cost_usecase_1.CalculateTournamentCostUsecase,
            strategy: 'singleton',
        });
        container.add({
            id: 'CalculateTournamentCostByIdUsecase',
            kind: calculate_tournament_cost_by_id_usecase_1.CalculateTournamentCostByIdUsecase,
            dependencies: [
                'GetTournamentByIdUsecase',
                'TournamentContract',
                'CalculateTournamentCostUsecase',
            ],
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
        // container.add({
        //   id: 'AddTeamsToTournamentUsecase',
        //   kind: AddTeamsToTournamentUsecase,
        //   dependencies: [
        //     'GetTournamentByIdUsecase',
        //     'GetTeamByIdUsecase',
        //     'CalculateTournamentCostUsecase',
        //     'CalculateTournamentInvoices',
        //   ],
        //   strategy: 'singleton',
        // });
        container.add({
            id: 'GetRegisteredTeamsByTournamentIdUsecase',
            kind: get_registered_teams_by_tournaments_usecase_1.GetRegisteredTeamsByTournamentIdUsecase,
            dependencies: ['RegisteredTeamsContract', 'GetTeamByIdUsecase'],
            strategy: 'singleton',
        });
        // container.add({
        //   id: 'GetGroupedMatchesByDateUsecase',
        //   kind: GetGroupedMatchesByDateUsecase,
        //   dependencies: ['TournamentContract'],
        //   strategy: 'singleton',
        // });
        container.add({
            id: 'GetMainDrawNodeMatchesoverviewusecase',
            kind: get_main_draw_node_matches_overview_usecase_1.GetMainDrawNodeMatchesoverviewusecase,
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
        //     'GetMainDrawNodeMatchesoverviewusecase',
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
        // container.add({
        //   id: 'GetIntergroupMatchesUsecase',
        //   kind: GetIntergroupMatchesUsecase,
        //   dependencies: ['TournamentContract'],
        //   strategy: 'singleton',
        // });
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
        // container.add({
        //   id: 'EditIntergroupMatchUsecase',
        //   kind: EditIntergroupMatchUsecase,
        //   dependencies: ['TournamentContract', 'FileAdapter'],
        //   strategy: 'singleton',
        // });
        // container.add({
        //   id: 'AddIntergroupMatchUsecase',
        //   kind: AddIntergroupMatchUsecase,
        //   dependencies: ['TournamentContract'],
        //   strategy: 'singleton',
        // });
        // container.add({
        //   id: 'GetPositionsTableUsecase',
        //   kind: GetPositionsTableUsecase,
        //   dependencies: [],
        //   strategy: 'singleton',
        // });
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
        // container.add({
        //   id: 'CreateMatchSheetUsecase',
        //   kind: CreateMatchSheetUsecase,
        //   dependencies: ['FileAdapter', 'GetTournamentOverviewByIdUsecase'],
        //   strategy: 'singleton',
        // });
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
    }
}
exports.TournamentsModulesConfig = TournamentsModulesConfig;
