import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { GetCurrentMobileVersionUsecase } from './domain/usecases/get-current-mobile-version/get-current-mobile-version.usecase';
import { MobileVersionContract } from './domain/administration.contract';
import { MobileVersionRepository } from './infrastructure/mobile-versions.repository';
import { MobileVersionMapper } from './infrastructure/mobile-versions.mapper';

export class InvoicesModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'MobileVersionMapper',
      kind: MobileVersionMapper,
      strategy: 'singleton',
    });
    container.add({
      id: 'MobileVersionContract',
      kind: MobileVersionContract,
      override: MobileVersionRepository,
      dependencies: ['DataSource', 'MobileVersionMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetCurrentMobileVersionUsecase',
      kind: GetCurrentMobileVersionUsecase,
      dependencies: ['MobileVersionContract'],
      strategy: 'singleton',
    });
  }
}
