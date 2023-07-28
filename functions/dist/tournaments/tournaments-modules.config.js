"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsModulesConfig = void 0;
const tournament_contract_1 = require("./domain/contracts/tournament.contract");
const calculate_tournament_cost_by_id_usecase_1 = require("./domain/usecases/calculate-tournament-cost-by-id/calculate-tournament-cost-by-id.usecase");
const calculate_tournament_cost_usecase_1 = require("./domain/usecases/calculate-tournament-cost/calculate-tournament-cost.usecase");
const get_fixture_stages_by_tournament_usecase_1 = require("./domain/usecases/fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase");
const get_main_draw_node_matches_overview_usecase_1 = require("./domain/usecases/get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase");
const get_registered_teams_by_tournaments_usecase_1 = require("./domain/usecases/registered-team/get-registered-teams-by-tournaments/get-registered-teams-by-tournaments.usecase");
const get_tournament_by_id_usecase_1 = require("./domain/usecases/get-tournament-by-id/get-tournament-by-id.usecase");
const get_tournaments_by_organization_usecase_1 = require("./domain/usecases/get-tournaments-by-organization/get-tournaments-by-organization.usecase");
const get_tournaments_usecase_1 = require("./domain/usecases/get-tournaments/get-tournaments.usecase");
const delete_group_by_id_usecase_1 = require("./domain/usecases/groups/delete-group-by-id/delete-group-by-id.usecase");
const get_group_by_id_usecase_1 = require("./domain/usecases/groups/get-group-by-id/get-group-by-id.usecase");
const get_group_by_label_usecase_1 = require("./domain/usecases/groups/get-group-by-label/get-group-by-label.usecase");
const get_groups_by_fixture_stage_usecase_1 = require("./domain/usecases/groups/get-groups-by-fixture-stage/get-groups-by-fixture-stage.usecase");
const save_group_usecase_1 = require("./domain/usecases/groups/save-group/save-group.usecase");
const update_teams_in_group_usecase_1 = require("./domain/usecases/groups/update-teams-in-group/update-teams-in-group.usecase");
const update_group_usecase_1 = require("./domain/usecases/groups/update-group/update-group.usecase");
const update_tournament_usecase_1 = require("./domain/usecases/update-tournament/update-tournament.usecase");
const fixture_stage_contract_1 = require("./domain/contracts/fixture-stage.contract");
const group_contract_1 = require("./domain/contracts/group.contract");
const node_match_contract_1 = require("./domain/contracts/node-match.contract");
const registered_teams_contract_1 = require("./domain/contracts/registered-teams.contract");
const financialStatements_mapper_1 = require("./infrastructure/mappers/financialStatements.mapper");
const fixture_stage_mapper_1 = require("./infrastructure/mappers/fixture-stage.mapper");
const group_mapper_1 = require("./infrastructure/mappers/group.mapper");
const match_mapper_1 = require("./infrastructure/mappers/match.mapper");
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
const match_contract_1 = require("./domain/contracts/match.contract");
const match_repository_1 = require("./infrastructure/repositories/match.repository");
const create_tournament_usecase_1 = require("./domain/usecases/create-tournament/create-tournament.usecase");
const exists_tournament_usecase_1 = require("./domain/usecases/exists-tournament/exists-tournament.usecase");
const delete_tournament_usecase_1 = require("./domain/usecases/delete-tournament/delete-tournament.usecase");
const get_markers_table_usecase_1 = require("./domain/usecases/get-markers-table/get-markers-table.usecase");
const create_fixture_stage_usecase_1 = require("./domain/usecases/fixture-stages/create-fixture-stage/create-fixture-stage.usecase");
const get_posible_teams_to_add_usecase_1 = require("./domain/usecases/get-posible-teams-to-add/get-posible-teams-to-add.usecase");
const get_register_team_qr_usecase_1 = require("./domain/usecases/get-register-team-qr/get-register-team-qr.usecase");
const add_teams_to_tournament_usecase_1 = require("./domain/usecases/add-team-to-tournament/add-teams-to-tournament.usecase");
const modify_tournament_status_usecase_1 = require("./domain/usecases/modify-tournament-status/modify-tournament-status.usecase");
const add_teams_to_group_inside_tournament_usecase_1 = require("./domain/usecases/add-teams-to-group-inside-tournament/add-teams-to-group-inside-tournament.usecase");
const delete_fixture_stage_usecase_1 = require("./domain/usecases/fixture-stages/delete-fixture-stage/delete-fixture-stage.usecase");
const delete_teams_in_group_usecase_1 = require("./domain/usecases/groups/delete-teams-in-group/delete-teams-in-group.usecase");
const modify_registered_team_status_usecase_1 = require("./domain/usecases/registered-team/modify-registered-team-status/modify-registered-team-status.usecase");
const get_registered_team_by_id_usecase_1 = require("./domain/usecases/registered-team/get-registered-team-by-id/get-registered-team-by-id.usecase");
const update_registered_team_by_id_usecase_1 = require("./domain/usecases/registered-team/update-registered-team-by-id/update-registered-team-by-id.usecase");
const add_match_to_group_inside_tournament_usecase_1 = require("./domain/usecases/group-matches/add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase");
const get_new_matches_to_add_in_group_usecase_1 = require("./domain/usecases/group-matches/get-new-matches-to-add-in-group/get-new-matches-to-add-in-group.usecase");
const complete_group_matches_usecase_1 = require("./domain/usecases/group-matches/complete-group-matches/complete-group-matches.usecase");
const delete_match_by_id_usecase_1 = require("./domain/usecases/group-matches/delete-match-by-id/delete-match-by-id.usecase");
const get_match_by_id_usecase_1 = require("./domain/usecases/group-matches/get-match-by-id/get-match-by-id.usecase");
const delete_matches_where_team_id_exists_usecase_1 = require("./domain/usecases/group-matches/delete-matches-where-team-id-exists/delete-matches-where-team-id-exists.usecase");
const modify_tournament_locations_usecase_1 = require("./domain/usecases/modify-tournament-locations/modify-tournament-locations.usecase");
const edit_match_to_group_inside_tournament_usecase_1 = require("./domain/usecases/group-matches/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase");
const get_positions_table_usecase_1 = require("./domain/usecases/get-positions-table.usecase");
const get_positions_table_by_group_usecase_1 = require("./domain/usecases/get-positions-table-by-group.usecase");
const get_tournaments_by_ratio_usecase_1 = require("./domain/usecases/get-tournaments-by-ratio/get-tournaments-by-ratio.usecase");
const intergroup_match_mapper_1 = require("./infrastructure/mappers/intergroup-match.mapper");
const intergroup_match_contract_1 = require("./domain/contracts/intergroup-match.contract");
const intergroup_match_repository_1 = require("./infrastructure/repositories/intergroup-match.repository");
const add_intergroup_match_usecase_1 = require("./domain/usecases/intergroup-matches/add-intergroup-match/add-intergroup-match.usecase");
const get_intergroup_match_usecase_1 = require("./domain/usecases/intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase");
const edit_intergroup_match_usecase_1 = require("./domain/usecases/intergroup-matches/edit-intergroup-match/edit-intergroup-match.usecase");
const delete_intergroup_match_usecase_1 = require("./domain/usecases/intergroup-matches/delete-intergroup-match/delete-intergroup-match.usecase");
const get_current_tournaments_usecase_1 = require("./domain/usecases/get-current-tournaments/get-current-tournaments.usecase");
const update_positions_table_usecase_1 = require("./domain/usecases/update-positions-table/update-positions-table.usecase");
const get_intergroup_match_by_team_ids_usecase_1 = require("./domain/usecases/intergroup-matches/get-intergroup-match-by-team-ids/get-intergroup-match-by-team-ids.usecase");
const get_match_by_team_ids_usecase_1 = require("./domain/usecases/group-matches/get-match-by-team-ids/get-match-by-team-ids.usecase");
const get_any_match_by_team_ids_usecase_1 = require("./domain/usecases/groups/get-any-match-by-team-ids/get-any-match-by-team-ids.usecase");
const delete_registered_team_by_id_usecase_1 = require("./domain/usecases/registered-team/delete-registered-team-by-id/delete-registered-team-by-id.usecase");
const create_match_sheet_usecase_1 = require("./domain/usecases/create-match-sheet/create-match-sheet.usecase");
const get_all_group_matches_by_tournament_usecase_1 = require("./domain/usecases/get-all-group-matches-by-tournament/get-all-group-matches-by-tournament.usecase");
const get_all_matches_grouped_by_date_usecase_1 = require("./domain/usecases/get-all-matches-grouped-by-date/get-all-matches-grouped-by-date.usecase");
const modify_tournament_referees_usecase_1 = require("./domain/usecases/modify-tournament-referees/modify-tournament-referees.usecase");
const location_contract_1 = require("./domain/contracts/location.contract");
const location_repository_1 = require("./infrastructure/repositories/location.repository");
const team_contract_1 = require("./domain/contracts/team.contract");
const team_repository_1 = require("./infrastructure/repositories/team.repository");
const organization_contract_1 = require("./domain/contracts/organization.contract");
const organization_repository_1 = require("./infrastructure/repositories/organization.repository");
const member_mapper_1 = require("./infrastructure/mappers/member.mapper");
const authorization_contract_1 = require("./domain/contracts/authorization.contract");
const authorization_repository_1 = require("./infrastructure/repositories/authorization.repository");
const get_all_matches_by_date_usecase_1 = require("./domain/usecases/get-all-matches-by-date/get-all-matches-by-date.usecase");
class TournamentsModulesConfig {
    static config(container) {
        container.add({
            id: 'LocationContract',
            kind: location_contract_1.LocationContract,
            override: location_repository_1.LocationRepository,
            strategy: 'singleton',
        });
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
            id: 'StadisticSpecificationMapper',
            kind: stadistics_mapper_1.StadisticSpecificationMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'StadisticsMapper',
            kind: stadistics_mapper_1.StadisticsMapper,
            dependencies: ['StadisticSpecificationMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'PlayerFormMapper',
            kind: player_form_mapper_1.PlayerFormMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'RefereeInMatchMapper',
            kind: match_mapper_1.RefereeInMatchMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'MatchMapper',
            kind: match_mapper_1.MatchMapper,
            dependencies: [
                'ScoreMapper',
                'PlayerFormMapper',
                'StadisticsMapper',
                'RefereeInMatchMapper',
                'FileAdapter',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'IntergroupMatchMapper',
            kind: intergroup_match_mapper_1.IntergroupMatchMapper,
            dependencies: ['MatchMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FlatPointsStadisticsMapper',
            kind: group_mapper_1.FlatPointsStadisticsMapper,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'LinearStadisticMapper',
            kind: group_mapper_1.LinearStadisticMapper,
            dependencies: ['FlatPointsStadisticsMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'PositionTableMapper',
            kind: group_mapper_1.PositionTableMapper,
            dependencies: ['LinearStadisticMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GroupMapper',
            kind: group_mapper_1.GroupMapper,
            dependencies: ['PositionTableMapper'],
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
            id: 'MemberMapper',
            kind: member_mapper_1.MemberMapper,
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
            id: 'IntergroupMatchContract',
            kind: intergroup_match_contract_1.IntergroupMatchContract,
            override: intergroup_match_repository_1.IntergroupMatchRepository,
            dependencies: ['Firestore', 'IntergroupMatchMapper'],
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
        container.add({
            id: 'OrganizationContract',
            kind: organization_contract_1.OrganizationContract,
            override: organization_repository_1.OrganizationRepository,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'AuthorizationContract',
            kind: authorization_contract_1.AuthorizationContract,
            override: authorization_repository_1.AuthorizationRepository,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'TeamContract',
            kind: team_contract_1.TeamContract,
            override: team_repository_1.TeamRepository,
            strategy: 'singleton',
        });
        container.add({
            id: 'GetRegisteredTeamsByTournamentIdUsecase',
            kind: get_registered_teams_by_tournaments_usecase_1.GetRegisteredTeamsByTournamentIdUsecase,
            dependencies: ['RegisteredTeamsContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'DeleteRegisteredTeamByIdUsecase',
            kind: delete_registered_team_by_id_usecase_1.DeleteRegisteredTeamByIdUsecase,
            dependencies: ['RegisteredTeamsContract'],
            strategy: 'singleton',
        });
        (function matches() {
            container.add({
                id: 'GetMatchByIdUsecase',
                kind: get_match_by_id_usecase_1.GetMatchByIdUsecase,
                dependencies: ['MatchContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'DeleteMatchByIdUsecase',
                kind: delete_match_by_id_usecase_1.DeleteMatchByIdUsecase,
                dependencies: ['MatchContract', 'GetMatchByIdUsecase'],
                strategy: 'singleton',
            });
            container.add({
                id: 'GetGroupMatchesUsecase',
                kind: get_group_matches_usecase_1.GetGroupMatchesUsecase,
                dependencies: ['MatchContract'],
                strategy: 'singleton',
            });
            container.add({
                id: 'DeleteMatchesWhereTeamIdExistsUsecase',
                kind: delete_matches_where_team_id_exists_usecase_1.DeleteMatchesWhereTeamIdExistsUsecase,
                dependencies: ['GetGroupMatchesUsecase', 'DeleteMatchByIdUsecase'],
                strategy: 'singleton',
            });
        })(),
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
                        'TeamContract',
                        'GroupContract',
                    ],
                    strategy: 'singleton',
                });
                container.add({
                    id: 'DeleteTeamsInGroupUsecase',
                    kind: delete_teams_in_group_usecase_1.DeleteTeamsInGroupUsecase,
                    dependencies: [
                        'GetGroupByIdUsecase',
                        'UpdateGroupUsecase',
                        'DeleteMatchesWhereTeamIdExistsUsecase',
                    ],
                    strategy: 'singleton',
                });
                container.add({
                    id: 'GetNewMatchesToAddInGroupUsecase',
                    kind: get_new_matches_to_add_in_group_usecase_1.GetNewMatchesToAddInGroupUsecase,
                    dependencies: ['GetGroupByIdUsecase', 'GetGroupMatchesUsecase'],
                    strategy: 'singleton',
                });
                container.add({
                    id: 'CompleteGroupMatchesUsecase',
                    kind: complete_group_matches_usecase_1.CompleteGroupMatchesUsecase,
                    dependencies: [
                        'GetNewMatchesToAddInGroupUsecase',
                        'AddMatchToGroupInsideTournamentUsecase',
                    ],
                    strategy: 'singleton',
                });
                container.add({
                    id: 'AddTeamsToGroupInsideTournamentUsecase',
                    kind: add_teams_to_group_inside_tournament_usecase_1.AddTeamsToGroupInsideTournamentUsecase,
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
            id: 'DeleteFixtureStageUsecase',
            kind: delete_fixture_stage_usecase_1.DeleteFixtureStageUsecase,
            dependencies: [
                'FixtureStageContract',
                'GetGroupsByFixtureStageUsecase',
                'DeleteGroupByIdUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'CreateFixtureStageUsecase',
            kind: create_fixture_stage_usecase_1.CreateFixtureStageUsecase,
            dependencies: ['FixtureStageContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetAllGroupMatchesByTournamentUsecase',
            kind: get_all_group_matches_by_tournament_usecase_1.GetAllGroupMatchesByTournamentUsecase,
            dependencies: [
                'GetFixtureStagesByTournamentUsecase',
                'GetGroupsByFixtureStageUsecase',
                'GetGroupMatchesUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetAllMatchesByDateUsecase',
            kind: get_all_matches_by_date_usecase_1.GetAllMatchesByDateUsecase,
            dependencies: [
                'TournamentContract',
                'GetAllGroupMatchesByTournamentUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetMarkersTableUsecase',
            kind: get_markers_table_usecase_1.GetMarkersTableUsecase,
            dependencies: ['GetAllGroupMatchesByTournamentUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetAllMatchesGroupedByDateUsecase',
            kind: get_all_matches_grouped_by_date_usecase_1.GetAllMatchesGroupedByDateUsecase,
            dependencies: ['GetAllGroupMatchesByTournamentUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsByUniqueAttributesUsecase',
            kind: exists_tournament_usecase_1.GetTournamentsByUniqueAttributesUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'UpdateTournamentUsecase',
            kind: update_tournament_usecase_1.UpdateTournamentUsecase,
            dependencies: [
                'TournamentContract',
                'GetTournamentsByUniqueAttributesUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'DeleteTournamentUsecase',
            kind: delete_tournament_usecase_1.DeleteTournamentUsecase,
            dependencies: [
                'TournamentContract',
                'GetTournamentByIdUsecase',
                'UpdateTournamentUsecase',
                'FileAdapter',
            ],
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
            kind: get_posible_teams_to_add_usecase_1.GetPosibleTeamsToAddUsecase,
            dependencies: ['TeamContract', 'RegisteredTeamsContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsUsecase',
            kind: get_tournaments_usecase_1.GetTournamentsUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetCurrentTournamentsUsecase',
            kind: get_current_tournaments_usecase_1.GetCurrentTournamentsUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsByRatioUsecase',
            kind: get_tournaments_by_ratio_usecase_1.GetTournamentsByRatioUsecase,
            dependencies: ['TournamentContract', 'LocationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsByOrganizationAndTournamentLayoutUsecase',
            kind: get_tournaments_by_organization_usecase_1.GetTournamentsByOrganizationAndTournamentLayoutUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AddMatchToGroupInsideTournamentUsecase',
            kind: add_match_to_group_inside_tournament_usecase_1.AddMatchToGroupInsideTournamentUsecase,
            dependencies: ['MatchContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetMatchByTeamIdsUsecase',
            kind: get_match_by_team_ids_usecase_1.GetMatchByTeamIdsUsecase,
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
            id: 'UpdatePositionTableUsecase',
            kind: update_positions_table_usecase_1.UpdatePositionTableUsecase,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'EditMatchInsideGroupUsecase',
            kind: edit_match_to_group_inside_tournament_usecase_1.EditMatchInsideGroupUsecase,
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
        container.add({
            id: 'AddTeamsToTournamentUsecase',
            kind: add_teams_to_tournament_usecase_1.AddTeamsToTournamentUsecase,
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
            kind: get_main_draw_node_matches_overview_usecase_1.GetMainDrawNodeMatchesoverviewUsecase,
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
            kind: get_intergroup_match_usecase_1.GetIntergroupMatchesUsecase,
            dependencies: ['IntergroupMatchContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetIntergroupMatchByTeamIdsUsecase',
            kind: get_intergroup_match_by_team_ids_usecase_1.GetIntergroupMatchByTeamIdsUsecase,
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
            kind: edit_intergroup_match_usecase_1.EditIntergroupMatchUsecase,
            dependencies: ['IntergroupMatchContract', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'DeleteIntergroupMatchUsecase',
            kind: delete_intergroup_match_usecase_1.DeleteIntergroupMatchUsecase,
            dependencies: ['IntergroupMatchContract', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AddIntergroupMatchUsecase',
            kind: add_intergroup_match_usecase_1.AddIntergroupMatchUsecase,
            dependencies: ['IntergroupMatchContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPositionsTableUsecase',
            kind: get_positions_table_usecase_1.GetPositionsTableUsecase,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPositionsTableByGroupUsecase',
            kind: get_positions_table_by_group_usecase_1.GetPositionsTableByGroupUsecase,
            dependencies: [
                'GetGroupMatchesUsecase',
                'GetPositionsTableUsecase',
                'GetIntergroupMatchesUsecase',
                'GetGroupByIdUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetAnyMatchByTeamIdsUsecase',
            kind: get_any_match_by_team_ids_usecase_1.GetAnyMatchByTeamIdsUsecase,
            dependencies: [
                'GetMatchByTeamIdsUsecase',
                'GetIntergroupMatchByTeamIdsUsecase',
            ],
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
            kind: create_match_sheet_usecase_1.CreateMatchSheetUsecase,
            dependencies: [
                'FileAdapter',
                'GetTournamentByIdUsecase',
                'OrganizationContract',
                'TeamContract',
            ],
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
            id: 'CreateTournamentUsecase',
            kind: create_tournament_usecase_1.CreateTournamentUsecase,
            dependencies: [
                'TournamentContract',
                'OrganizationContract',
                'FileAdapter',
                'GetTournamentsByUniqueAttributesUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetRegisterTeamQRUsecase',
            kind: get_register_team_qr_usecase_1.GetRegisterTeamQRUsecase,
            strategy: 'singleton',
        });
        container.add({
            id: 'ModifyTournamentStatusUsecase',
            kind: modify_tournament_status_usecase_1.ModifyTournamentStatusUsecase,
            dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'ModifyTournamentLocationsUsecase',
            kind: modify_tournament_locations_usecase_1.ModifyTournamentLocationsUsecase,
            dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'ModifyTournamentRefereesUsecase',
            kind: modify_tournament_referees_usecase_1.ModifyTournamentRefereesUsecase,
            dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetRegisteredTeamByIdUsecase',
            kind: get_registered_team_by_id_usecase_1.GetRegisteredTeamByIdUsecase,
            dependencies: ['RegisteredTeamsContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'UpdateRegisteredTeamByIdUsecase',
            kind: update_registered_team_by_id_usecase_1.UpdateRegisteredTeamByIdUsecase,
            dependencies: ['GetRegisteredTeamByIdUsecase', 'RegisteredTeamsContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'ModifyRegisteredTeamStatusUsecase',
            kind: modify_registered_team_status_usecase_1.ModifyRegisteredTeamStatusUsecase,
            dependencies: [
                'GetRegisteredTeamByIdUsecase',
                'UpdateRegisteredTeamByIdUsecase',
            ],
            strategy: 'singleton',
        });
    }
}
exports.TournamentsModulesConfig = TournamentsModulesConfig;
