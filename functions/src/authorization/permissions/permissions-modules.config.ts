import { Container } from '../../core/DI';
import { PermissionContract } from './domain/permission.contract';
import { GetPermissionByIdUsecase } from './domain/usecases/get-permission-by-id.usecase';
import { PermissionMapper } from './infrastructure/permission.mapper';
import { PermissionRepository } from './infrastructure/permission.repository';

export class PermissionModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'PermissionMapper',
      kind: PermissionMapper,
      strategy: 'singleton',
    });

    container.add({
      id: 'PermissionContract',
      kind: PermissionContract,
      override: PermissionRepository,
      dependencies: ['DataSource', 'PermissionMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetPermissionByIdUsecase',
      kind: GetPermissionByIdUsecase,
      dependencies: ['PermissionContract'],
      strategy: 'singleton',
    });
  }
}
