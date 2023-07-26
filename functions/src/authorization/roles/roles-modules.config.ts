import { Container } from '../../core/DI';
import { RoleContract } from './domain/role.contract';
import { GetRoleByIdUsecase } from './domain/usecases/get-role-by-id.usecase';
import { RoleMapper } from './infrastructure/role.mapper';
import { RoleRepository } from './infrastructure/role.repository';

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
  }
}
