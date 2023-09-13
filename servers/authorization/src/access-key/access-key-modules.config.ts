import { AccessKeyContract } from './domain/contracts/access-key.contract';
import { IsAValidAccessKeyUsecase } from './domain/usecases/is-a-valid-access-key/is-a-valid-access-key.usecase';
import { AccessKeyMapper } from './infrastructure/mappers/access-key.mapper';
import { AccessKeyRepository } from './infrastructure/access-key.repository';
import { Container } from '@scifamek-open-source/iraca/dependency-injection';

export class AccessKeyModulesConfig {
  static config(container: Container) {
    
    
    container.add({
      id: 'AccessKeyMapper',
      kind: AccessKeyMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'AccessKeyContract',
      kind: AccessKeyContract,
      override: AccessKeyRepository,
      dependencies: ['DataSource', 'AccessKeyMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'IsAValidAccessKeyUsecase',
      kind: IsAValidAccessKeyUsecase,
      dependencies: ['AccessKeyContract'],
      strategy: 'singleton',
    });
    
  }
}
