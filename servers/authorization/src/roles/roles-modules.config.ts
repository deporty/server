import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { RoleContract } from './domain/role.contract';
import { GetRoleByIdUsecase } from './domain/usecases/get-role-by-id.usecase';
import { RoleMapper } from './infrastructure/role.mapper';
import { RoleRepository } from './infrastructure/role.repository';
import { GetRolesUsecase } from './domain/usecases/get-roles/get-roles.usecase';

export class RoleModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'RoleMapper',
      kind: RoleMapper,
      strategy: 'singleton',
    });

    container.add({
      id: 'RoleContract',
      kind: RoleContract,
      override: RoleRepository,
      dependencies: ['DataSource', 'RoleMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetRoleByIdUsecase',
      kind: GetRoleByIdUsecase,
      dependencies: ['RoleContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetRolesUsecase',
      kind: GetRolesUsecase,
      dependencies: ['RoleContract'],
      strategy: 'singleton',
    });
  }
}
