import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { ResourceContract } from './domain/resource.contract';
import { GetResourceByIdUsecase } from './domain/usecases/get-resource-by-id.usecase';
import { ResourceMapper } from './infrastructure/resource.mapper';
import { ResourceRepository } from './infrastructure/resource.repository';
import { GetResourcesUsecase } from './domain/usecases/get-resources.usecase';



export class ResourceModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'ResourceMapper',
      kind: ResourceMapper,
      strategy: 'singleton',
    });

    container.add({
      id: 'ResourceContract',
      kind: ResourceContract,
      override: ResourceRepository,
      dependencies: ['DataSource', 'ResourceMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetResourceByIdUsecase',
      kind: GetResourceByIdUsecase,
      dependencies: ['ResourceContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetResourcesUsecase',
      kind: GetResourcesUsecase,
      dependencies: ['ResourceContract'],
      strategy: 'singleton',
    });
  }
}
