"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsModulesConfig = void 0;
const authorization_contract_1 = require("./domain/contracts/authorization.contract");
const member_contract_1 = require("./domain/contracts/member.contract");
const sport_contract_1 = require("./domain/contracts/sport.contract");
const team_contract_1 = require("./domain/contracts/team.contract");
const user_constract_1 = require("./domain/contracts/user.constract");
const create_team_usecase_1 = require("./domain/usecases/create-team/create-team.usecase");
const delete_team_usecase_1 = require("./domain/usecases/delete-team/delete-team.usecase");
const edit_team_usecase_1 = require("./domain/usecases/edit-team/edit-team.usecase");
const get_member_by_id_usecase_1 = require("./domain/usecases/get-member-by-id/get-member-by-id.usecase");
const get_members_by_team_usecase_1 = require("./domain/usecases/get-members-by-team/get-members-by-team.usecase");
const get_sport_by_id_usecase_1 = require("./domain/usecases/get-sport-by-id/get-sport-by-id.usecase");
const get_team_by_id_usecase_1 = require("./domain/usecases/get-team-by-id/get-team-by-id.usecase");
const get_team_by_name_usecase_1 = require("./domain/usecases/get-team-by-name/get-team-by-name.usecase");
const get_teams_by_advanced_filters_usecase_1 = require("./domain/usecases/get-teams-by-advanced-filters/get-teams-by-advanced-filters.usecase");
const get_teams_by_filters_usecase_1 = require("./domain/usecases/get-teams-by-filters/get-teams-by-filters.usecase");
const get_teams_usecase_1 = require("./domain/usecases/get-teams/get-teams.usecase");
const member_mapper_1 = require("./infrastructure/member.mapper");
const authorization_repository_1 = require("./infrastructure/repository/authorization.repository");
const member_repository_1 = require("./infrastructure/repository/member.repository");
const sport_repository_1 = require("./infrastructure/repository/sport.repository");
const team_repository_1 = require("./infrastructure/repository/team.repository");
const user_repository_1 = require("./infrastructure/repository/user.repository");
const sport_mapper_1 = require("./infrastructure/sport.mapper");
const team_mapper_1 = require("./infrastructure/team.mapper");
class TeamsModulesConfig {
    static config(container) {
        container.add({
            id: 'SportMapper',
            kind: sport_mapper_1.SportMapper,
            strategy: 'singleton',
            dependencies: [],
        });
        container.add({
            id: 'MemberMapper',
            kind: member_mapper_1.MemberMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'SportContract',
            kind: sport_contract_1.SportContract,
            override: sport_repository_1.SportRepository,
            strategy: 'singleton',
            dependencies: ['DataSource', 'SportMapper'],
        });
        container.add({
            id: 'UserContract',
            kind: user_constract_1.UserContract,
            override: user_repository_1.UserRepository,
            strategy: 'singleton',
        });
        container.add({
            id: 'AuthorizationContract',
            kind: authorization_contract_1.AuthorizationContract,
            override: authorization_repository_1.AuthorizationRepository,
            strategy: 'singleton',
        });
        container.add({
            id: 'GetSportByIdUsecase',
            kind: get_sport_by_id_usecase_1.GetSportByIdUsecase,
            strategy: 'singleton',
            dependencies: ['SportContract'],
        });
        container.add({
            id: 'TeamMapper',
            kind: team_mapper_1.TeamMapper,
            strategy: 'singleton',
            dependencies: ['FileAdapter'],
        });
        container.add({
            id: 'TeamContract',
            kind: team_contract_1.TeamContract,
            override: team_repository_1.TeamRepository,
            dependencies: ['DataSource', 'TeamMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'MemberContract',
            kind: member_contract_1.MemberContract,
            override: member_repository_1.MemberRepository,
            dependencies: ['Firestore', 'MemberMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTeamByNameUsecase',
            kind: get_team_by_name_usecase_1.GetTeamByNameUsecase,
            dependencies: ['TeamContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTeamByAdvancedFiltersUsecase',
            kind: get_teams_by_advanced_filters_usecase_1.GetTeamByAdvancedFiltersUsecase,
            dependencies: ['TeamContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTeamByFiltersUsecase',
            kind: get_teams_by_filters_usecase_1.GetTeamByFiltersUsecase,
            dependencies: ['TeamContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTeamsUsecase',
            kind: get_teams_usecase_1.GetTeamsUsecase,
            dependencies: ['TeamContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetMemberByIdUsecase',
            kind: get_member_by_id_usecase_1.GetMemberByIdUsecase,
            dependencies: ['MemberContract', 'UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetMembersByTeamUsecase',
            kind: get_members_by_team_usecase_1.GetMembersByTeamUsecase,
            dependencies: ['MemberContract', 'UserContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'DeleteTeamUsecase',
            kind: delete_team_usecase_1.DeleteTeamUsecase,
            dependencies: ['TeamContract', 'GetTeamByIdUsecase', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTeamByIdUsecase',
            kind: get_team_by_id_usecase_1.GetTeamByIdUsecase,
            dependencies: ['TeamContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'EditTeamUsecase',
            kind: edit_team_usecase_1.EditTeamUsecase,
            dependencies: ['TeamContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'CreateTeamUsecase',
            kind: create_team_usecase_1.CreateTeamUsecase,
            dependencies: [
                'TeamContract',
                'GetTeamByNameUsecase',
                'EditTeamUsecase',
                'FileAdapter',
            ],
            strategy: 'singleton',
        });
        // container.add({
        //   id: 'AsignPlayerToTeamUsecase',
        //   kind: AsignPlayerToTeamUsecase,
        //   dependencies: [
        //     'TeamContract',
        //     'GetTeamByIdUsecase',
        //     'GetPlayerByIdUsecase',
        //     'UpdateTournamentUsecase',
        //     'GetActiveTournamentsByRegisteredTeamUsecase',
        //   ],
        //   strategy: 'singleton',
        // });
    }
}
exports.TeamsModulesConfig = TeamsModulesConfig;
