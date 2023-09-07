import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { ResourceContract } from '../domain/resource.contract';
import { RESOURCES_ENTITY } from './resource.constants';
import { ResourceMapper } from './resource.mapper';

export class ResourceRepository extends ResourceContract {
  static entity = RESOURCES_ENTITY;

  constructor(
    protected dataSource: DataSource<any>,
    protected resourceMapper: ResourceMapper
  ) {
    super(dataSource, resourceMapper);

    this.entity = ResourceRepository.entity;
  }
}
