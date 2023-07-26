"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsModulesConfig = void 0;
const fixture_stage_mapper_1 = require("./infrastructure/fixture-stage.mapper");
const fixture_mapper_1 = require("./infrastructure/fixture.mapper");
const group_mapper_1 = require("./infrastructure/group.mapper");
const match_mapper_1 = require("./infrastructure/match.mapper");
const player_form_mapper_1 = require("./infrastructure/player-form.mapper");
const registered_teams_mapper_1 = require("./infrastructure/registered-teams.mapper");
const tournament_repository_1 = require("./infrastructure/repository/tournament.repository");
const score_mapper_1 = require("./infrastructure/score.mapper");
const stadistics_mapper_1 = require("./infrastructure/stadistics.mapper");
const tournament_mapper_1 = require("./infrastructure/tournament.mapper");
const tournament_contract_1 = require("./tournament.contract");
const add_match_to_group_inside_tournament_usecase_1 = require("./usecases/add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase");
const add_team_to_group_inside_tournament_usecase_1 = require("./usecases/add-team-to-group-inside-tournament/add-team-to-group-inside-tournament.usecase");
const add_team_to_tournament_usecase_1 = require("./usecases/add-team-to-tournament/add-team-to-tournament.usecase");
const add_teams_to_group_inside_tournament_usecase_1 = require("./usecases/add-teams-to-group-inside-tournament/add-teams-to-group-inside-tournament.usecase");
const create_fixture_by_group_usecase_1 = require("./usecases/create-fixture-by-group/create-fixture-by-group.usecase");
const edit_match_to_group_inside_tournament_usecase_1 = require("./usecases/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase");
const get_markers_table_usecase_1 = require("./usecases/get-markers-table/get-markers-table.usecase");
const get_posible_teams_to_add_usecase_1 = require("./usecases/get-posible-teams-to-add/get-posible-teams-to-add.usecase");
const get_tournament_by_id_usecase_1 = require("./usecases/get-tournament-by-id/get-tournament-by-id.usecase");
const get_tournaments_usecase_1 = require("./usecases/get-tournaments/get-tournaments.usecase");
const update_tournament_usecase_1 = require("./usecases/update-tournament/update-tournament.usecase");
class TournamentsModulesConfig {
    static config(container) {
        container.add({
            id: 'ScoreMapper',
            kind: score_mapper_1.ScoreMapper,
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
            dependencies: [
                'ScoreMapper',
                'TeamMapper',
                'StadisticsMapper',
                'PlayerFormMapper',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GroupMapper',
            kind: group_mapper_1.GroupMapper,
            dependencies: ['MatchMapper', 'TeamMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FixtureStageMapper',
            kind: fixture_stage_mapper_1.FixtureStageMapper,
            dependencies: ['GroupMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FixtureMapper',
            kind: fixture_mapper_1.FixtureMapper,
            dependencies: ['FixtureStageMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'RegisteredTeamMapper',
            kind: registered_teams_mapper_1.RegisteredTeamMapper,
            dependencies: ['TeamMapper', 'MemberMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'TournamentMapper',
            kind: tournament_mapper_1.TournamentMapper,
            dependencies: ['RegisteredTeamMapper', 'FixtureMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'TournamentContract',
            kind: tournament_contract_1.TournamentContract,
            override: tournament_repository_1.TournamentRepository,
            dependencies: ['DataSource', 'TournamentMapper', 'FirebaseDatabase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetMarkersTableUsecase',
            kind: get_markers_table_usecase_1.GetMarkersTableUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentByIdUsecase',
            kind: get_tournament_by_id_usecase_1.GetTournamentByIdUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'UpdateTournamentUsecase',
            kind: update_tournament_usecase_1.UpdateTournamentUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'CreateFixtureByGroupUsecase',
            kind: create_fixture_by_group_usecase_1.CreateFixtureByGroupUsecase,
            dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AddTeamToTournamentUsecase',
            kind: add_team_to_tournament_usecase_1.AddTeamToTournamentUsecase,
            dependencies: [
                'GetTournamentByIdUsecase',
                'GetTeamByIdUsecase',
                'UpdateTournamentUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPosibleTeamsToAddUsecase',
            kind: get_posible_teams_to_add_usecase_1.GetPosibleTeamsToAddUsecase,
            dependencies: ['GetTeamsUsecase', 'GetTournamentByIdUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsUsecase',
            kind: get_tournaments_usecase_1.GetTournamentsUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'AddMatchToGroupInsideTournamentUsecase',
            kind: add_match_to_group_inside_tournament_usecase_1.AddMatchToGroupInsideTournamentUsecase,
            dependencies: [
                'GetTournamentByIdUsecase',
                'UpdateTournamentUsecase',
                'GetTeamByIdUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'AddTeamToGroupInsideTournamentUsecase',
            kind: add_team_to_group_inside_tournament_usecase_1.AddTeamToGroupInsideTournamentUsecase,
            dependencies: [
                'GetTournamentByIdUsecase',
                'GetTeamByIdUsecase',
                'UpdateTournamentUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'AddTeamsToGroupInsideTournamentUsecase',
            kind: add_teams_to_group_inside_tournament_usecase_1.AddTeamsToGroupInsideTournamentUsecase,
            dependencies: [
                'GetTournamentByIdUsecase',
                'GetTeamByIdUsecase',
                'UpdateTournamentUsecase',
                'AddTeamToGroupInsideTournamentUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'EditMatchToGroupInsideTournamentUsecase',
            kind: edit_match_to_group_inside_tournament_usecase_1.EditMatchToGroupInsideTournamentUsecase,
            dependencies: ['GetTournamentByIdUsecase', 'UpdateTournamentUsecase'],
            strategy: 'singleton',
        });
    }
}
exports.TournamentsModulesConfig = TournamentsModulesConfig;
