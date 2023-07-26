import { DataSource } from '../../../core/datasource';
import { PermissionContract, } from '../domain/permission.contract';
import { PERMISSIONS_ENTITY } from './permission.constants';
import { PermissionMapper } from './permission.mapper';

export class PermissionRepository extends PermissionContract {
  static entity = PERMISSIONS_ENTITY;
  constructor(
    protected dataSource: DataSource<any>,
    protected permissionMapper: PermissionMapper
  ) {
    super(dataSource, permissionMapper);

    this.entity = PermissionRepository.entity;
  }
}
