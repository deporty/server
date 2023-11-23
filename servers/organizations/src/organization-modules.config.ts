import { GetOrganizationWhereExistsMemberEmailUsecase } from './domain/usecases/get-organization-where-exists-member-email.usecase';
import { GetOrganizationWhereExistsMemberIdUsecase } from './domain/usecases/get-organization-where-exists-member-id.usecase';
import { GetOrganizationsUsecase } from './domain/usecases/get-organizations/get-organizations.usecase';
import { OrganizationMapper } from './infrastructure/mappers/organization.mapper';
import { OrganizationRepository } from './infrastructure/repository/organization.repository';
import {
  FixtureStageConfigurationMapper,
  FixtureStagesConfigurationMapper,
  NegativePointsPerCardMapper,
  PointsConfigurationMapper,
  RequiredDocConfigMapper,
  SchemaMapper,
  TournamentLayoutMapper,
} from './infrastructure/mappers/tournament-layout.mapper';
import { OrganizationContract } from './domain/contracts/organization.contract';
import { GetTournamentLayoutsByOrganizationIdUsecase } from './domain/usecases/get-tournament-layouts-by-organization-id/get-tournament-layouts-by-organization-id.usecase';
import { TournamentLayoutContract } from './domain/contracts/tournament-layout.contract';
import { TournamentLayoutsRepository } from './infrastructure/repository/tournament-layout.repository';
import { GetOrganizationByIdUsecase } from './domain/usecases/get-organization-by-id/get-organization-by-id.usecase';
import { CreateTournamentLayoutUsecase } from './domain/usecases/create-tournament-layout/create-tournament-layout.usecase';
import { GetTournamentLayoutByIdUsecase } from './domain/usecases/get-tournament-layout-by-id/get-tournament-layout-by-id.usecase';
import { EditTournamentLayoutUsecase } from './domain/usecases/edit-tournament-layout/edit-tournament-layout.usecase';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserContract } from './domain/contracts/user.constract';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { AuthorizationRepository } from './infrastructure/repository/authorization.repository';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';

export class OrganizationModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'OrganizationMapper',
      kind: OrganizationMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'NegativePointsPerCardMapper',
      kind: NegativePointsPerCardMapper,
      dependencies: [],
      strategy: 'singleton',
    });
    container.add({
      id: 'RequiredDocConfigMapper',
      kind: RequiredDocConfigMapper,
      dependencies: [],
      strategy: 'singleton',
    });

    container.add({
      id: 'FixtureStageConfigurationMapper',
      kind: FixtureStageConfigurationMapper,
      dependencies: [],
      strategy: 'singleton',
    });

    container.add({
      id: 'PointsConfigurationMapper',
      kind: PointsConfigurationMapper,
      dependencies: [],
      strategy: 'singleton',
    });

    container.add({
      id: 'SchemaMapper',
      kind: SchemaMapper,
      dependencies: ['FixtureStageConfigurationMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'FixtureStagesConfigurationMapper',
      kind: FixtureStagesConfigurationMapper,
      dependencies: ['NegativePointsPerCardMapper', 'PointsConfigurationMapper', 'SchemaMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'TournamentLayoutMapper',
      kind: TournamentLayoutMapper,
      dependencies: [ 'FixtureStagesConfigurationMapper', 'RequiredDocConfigMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'OrganizationContract',
      kind: OrganizationContract,
      override: OrganizationRepository,
      dependencies: ['DataSource', 'OrganizationMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'UserContract',
      kind: UserContract,
      override: UserRepository,
      strategy: 'singleton',
    });
    container.add({
      id: 'AuthorizationContract',
      kind: AuthorizationContract,
      override: AuthorizationRepository,
      strategy: 'singleton',
    });
    container.add({
      id: 'TournamentLayoutContract',
      kind: TournamentLayoutContract,
      override: TournamentLayoutsRepository,
      dependencies: ['Firestore', 'TournamentLayoutMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetOrganizationWhereExistsMemberIdUsecase',
      kind: GetOrganizationWhereExistsMemberIdUsecase,
      dependencies: ['OrganizationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetOrganizationsUsecase',
      kind: GetOrganizationsUsecase,
      dependencies: ['OrganizationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetOrganizationWhereExistsMemberIdUsecase',
      kind: GetOrganizationWhereExistsMemberIdUsecase,
      dependencies: ['OrganizationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetOrganizationWhereExistsMemberEmailUsecase',
      kind: GetOrganizationWhereExistsMemberEmailUsecase,
      dependencies: ['UserContract', 'GetOrganizationWhereExistsMemberIdUsecase'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetTournamentLayoutsByOrganizationIdUsecase',
      kind: GetTournamentLayoutsByOrganizationIdUsecase,
      dependencies: ['TournamentLayoutContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetOrganizationByIdUsecase',
      kind: GetOrganizationByIdUsecase,
      dependencies: ['OrganizationContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'CreateTournamentLayoutUsecase',
      kind: CreateTournamentLayoutUsecase,
      dependencies: ['TournamentLayoutContract', 'FileAdapter'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetTournamentLayoutByIdUsecase',
      kind: GetTournamentLayoutByIdUsecase,
      dependencies: ['TournamentLayoutContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'EditTournamentLayoutUsecase',
      kind: EditTournamentLayoutUsecase,
      dependencies: ['TournamentLayoutContract', 'GetTournamentLayoutByIdUsecase'],
      strategy: 'singleton',
    });
  }
}
