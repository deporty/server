import { RoleEntity } from '@deporty-org/entities/authorization';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class RoleMapper extends Mapper<RoleEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      description: { name: 'description' },
      name: { name: 'name' },
      display: { name: 'display' },
      permissionIds: { name: 'permissions' },
    };
  }
}
