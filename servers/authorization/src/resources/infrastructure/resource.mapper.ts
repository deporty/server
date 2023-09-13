import { ResourceEntity } from '@deporty-org/entities/authorization';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class ResourceMapper extends Mapper<ResourceEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      domain: { name: 'domain' },
      kind: { name: 'kind' },
      layer: { name: 'layer' },
      name: { name: 'name' },
      visibility: { name: 'visibility' },
    };
  }
}
