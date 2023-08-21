import { Container } from '../core/DI';
import { AsignRolesToUserUsecase } from './domain/usecases/asign-roles-to-user/asign-roles-to-user.usecase';
import { GetUsersByFiltersUsecase } from './domain/usecases/get-user-by-filters/get-user-by-filters.usecase';
import { GetUserInformationByEmailUsecase } from './domain/usecases/get-user-information-by-email/get-user-information-by-email.usecase';
import { GetUserInformationByFullNameUsecase } from './domain/usecases/get-user-information-by-full-name/get-user-information-by-full-name.usecase';
import { UserContract } from './domain/contracts/user.contract';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AuthorizationRepository } from './infrastructure/repositories/authorization.repository';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { GetUserByIdUsecase } from './domain/usecases/get-user-by-id/get-user-by-id.usecase';
import { GetUsersByIdsUsecase } from './domain/usecases/get-users-by-ids/get-users-by-ids.usecase';
import { GetTeamsThatIBelongUsecase } from './domain/usecases/get-teams-that-i-belong/get-teams-that-i-belong.usecase';

export class UserModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'UserMapper',
      kind: UserMapper,
      dependencies: ['FileAdapter'],
      strategy: 'singleton',
    });

    container.add({
      id: 'UserContract',
      kind: UserContract,
      override: UserRepository,
      dependencies: ['DataSource', 'UserMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'AuthorizationContract',
      kind: AuthorizationContract,
      override: AuthorizationRepository,
      strategy: 'singleton',
    });

    container.add({
      id: 'GetUsersByFiltersUsecase',
      kind: GetUsersByFiltersUsecase,
      dependencies: ['UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetUserInformationByEmailUsecase',
      kind: GetUserInformationByEmailUsecase,
      dependencies: ['UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetUserByIdUsecase',
      kind: GetUserByIdUsecase,
      dependencies: ['UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetUsersByIdsUsecase',
      kind: GetUsersByIdsUsecase,
      dependencies: ['GetUserByIdUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'AsignRolesToUserUsecase',
      kind: AsignRolesToUserUsecase,
      dependencies: [
        'GetUserByIdUsecase',
        'AuthorizationContract',
        'UserContract',
      ],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetUserInformationByFullNameUsecase',
      kind: GetUserInformationByFullNameUsecase,
      dependencies: ['UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTeamsThatIBelongUsecase',
      kind: GetTeamsThatIBelongUsecase,
      strategy: 'singleton',
    });
  }
}
