"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModulesConfig = void 0;
const get_organization_where_exists_member_email_usecase_1 = require("./domain/usecases/get-organization-where-exists-member-email.usecase");
const get_organization_where_exists_member_id_usecase_1 = require("./domain/usecases/get-organization-where-exists-member-id.usecase");
const get_organizations_usecase_1 = require("./domain/usecases/get-organizations/get-organizations.usecase");
const organization_mapper_1 = require("./infrastructure/mappers/organization.mapper");
const organization_repository_1 = require("./infrastructure/repository/organization.repository");
const tournament_layout_mapper_1 = require("./infrastructure/mappers/tournament-layout.mapper");
const organization_contract_1 = require("./domain/contracts/organization.contract");
const get_tournament_layouts_by_organization_id_usecase_1 = require("./domain/usecases/get-tournament-layouts-by-organization-id/get-tournament-layouts-by-organization-id.usecase");
const tournament_layout_contract_1 = require("./domain/contracts/tournament-layout.contract");
const tournament_layout_repository_1 = require("./infrastructure/repository/tournament-layout.repository");
const get_organization_by_id_usecase_1 = require("./domain/usecases/get-organization-by-id/get-organization-by-id.usecase");
const create_tournament_layout_usecase_1 = require("./domain/usecases/create-tournament-layout/create-tournament-layout.usecase");
const get_tournament_layout_by_id_usecase_1 = require("./domain/usecases/get-tournament-layout-by-id/get-tournament-layout-by-id.usecase");
const edit_tournament_layout_usecase_1 = require("./domain/usecases/edit-tournament-layout/edit-tournament-layout.usecase");
const user_repository_1 = require("./infrastructure/repository/user.repository");
const user_constract_1 = require("./domain/contracts/user.constract");
const authorization_contract_1 = require("./domain/contracts/authorization.contract");
const authorization_repository_1 = require("./infrastructure/repository/authorization.repository");
class OrganizationModulesConfig {
    static config(container) {
        container.add({
            id: 'OrganizationMapper',
            kind: organization_mapper_1.OrganizationMapper,
            dependencies: ['FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'NegativePointsPerCardMapper',
            kind: tournament_layout_mapper_1.NegativePointsPerCardMapper,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'FixtureStageConfigurationMapper',
            kind: tournament_layout_mapper_1.FixtureStageConfigurationMapper,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'PointsConfigurationMapper',
            kind: tournament_layout_mapper_1.PointsConfigurationMapper,
            dependencies: [],
            strategy: 'singleton',
        });
        container.add({
            id: 'SchemaMapper',
            kind: tournament_layout_mapper_1.SchemaMapper,
            dependencies: ['FixtureStageConfigurationMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'FixtureStagesConfigurationMapper',
            kind: tournament_layout_mapper_1.FixtureStagesConfigurationMapper,
            dependencies: ['NegativePointsPerCardMapper', 'PointsConfigurationMapper', 'SchemaMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'TournamentLayoutMapper',
            kind: tournament_layout_mapper_1.TournamentLayoutMapper,
            dependencies: ['FileAdapter', 'FixtureStagesConfigurationMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'OrganizationContract',
            kind: organization_contract_1.OrganizationContract,
            override: organization_repository_1.OrganizationRepository,
            dependencies: ['DataSource', 'OrganizationMapper'],
            strategy: 'singleton',
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
            id: 'TournamentLayoutContract',
            kind: tournament_layout_contract_1.TournamentLayoutContract,
            override: tournament_layout_repository_1.TournamentLayoutsRepository,
            dependencies: ['Firestore', 'TournamentLayoutMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetOrganizationWhereExistsMemberIdUsecase',
            kind: get_organization_where_exists_member_id_usecase_1.GetOrganizationWhereExistsMemberIdUsecase,
            dependencies: ['OrganizationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetOrganizationsUsecase',
            kind: get_organizations_usecase_1.GetOrganizationsUsecase,
            dependencies: ['OrganizationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetOrganizationWhereExistsMemberIdUsecase',
            kind: get_organization_where_exists_member_id_usecase_1.GetOrganizationWhereExistsMemberIdUsecase,
            dependencies: ['OrganizationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetOrganizationWhereExistsMemberEmailUsecase',
            kind: get_organization_where_exists_member_email_usecase_1.GetOrganizationWhereExistsMemberEmailUsecase,
            dependencies: ['UserContract', 'GetOrganizationWhereExistsMemberIdUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentLayoutsByOrganizationIdUsecase',
            kind: get_tournament_layouts_by_organization_id_usecase_1.GetTournamentLayoutsByOrganizationIdUsecase,
            dependencies: ['TournamentLayoutContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetOrganizationByIdUsecase',
            kind: get_organization_by_id_usecase_1.GetOrganizationByIdUsecase,
            dependencies: ['OrganizationContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'CreateTournamentLayoutUsecase',
            kind: create_tournament_layout_usecase_1.CreateTournamentLayoutUsecase,
            dependencies: ['TournamentLayoutContract', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentLayoutByIdUsecase',
            kind: get_tournament_layout_by_id_usecase_1.GetTournamentLayoutByIdUsecase,
            dependencies: ['TournamentLayoutContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'EditTournamentLayoutUsecase',
            kind: edit_tournament_layout_usecase_1.EditTournamentLayoutUsecase,
            dependencies: ['TournamentLayoutContract', 'GetTournamentLayoutByIdUsecase'],
            strategy: 'singleton',
        });
    }
}
exports.OrganizationModulesConfig = OrganizationModulesConfig;
