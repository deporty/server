import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { UserContract } from './domain/contracts/user.constract';
import { GetAllowedResourcesByRoleIdsUsecase } from './resources/domain/usecases/get-allowed-resources-by-role-ids/get-allowed-resources-by-role-ids.usecase';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { GetTokenUsecase } from './domain/usecases/get-token/get-token.usecase';

export class AuthorizationModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'UserContract',
      kind: UserContract,
      override: UserRepository,
      strategy: 'singleton',
    });

    container.add({
      id: 'GetAllowedResourcesByRoleIdsUsecase',
      kind: GetAllowedResourcesByRoleIdsUsecase,
      strategy: 'singleton',
      dependencies: ['GetRoleByIdUsecase', 'GetPermissionByIdUsecase', 'GetResourceByIdUsecase'],
    });

    container.add({
      id: 'GetTokenUsecase',
      kind: GetTokenUsecase,
      dependencies: ['GetAllowedResourcesByRoleIdsUsecase', 'UserContract'],
      strategy: 'singleton',
    });
  }
}
