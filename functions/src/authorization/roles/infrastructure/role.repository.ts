import { DataSource } from '../../../core/datasource';
import { RoleContract } from '../domain/role.contract';
import { ROLES_ENTITY } from './role.constants';
import { RoleMapper } from './role.mapper';

export class RoleRepository extends RoleContract {
  static entity = ROLES_ENTITY;
  constructor(
    protected dataSource: DataSource<any>,
    protected roleMapper: RoleMapper
  ) {
    super(dataSource, roleMapper);

    this.entity = RoleRepository.entity;
  }
}
