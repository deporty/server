import { PermissionEntity } from '@deporty-org/entities/authorization';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class PermissionMapper extends Mapper<PermissionEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      name: { name: 'name' },
      display: { name: 'display' },
      resourceIds: { name: 'resources' },
    };
  }
}
