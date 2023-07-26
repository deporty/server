import { AccessKeyEntity } from '@deporty-org/entities/authorization';
import { DataSource } from '../../../core/datasource';
import { ACCESS_KEY_ENTITY } from '../../infrastructure/authorization.constants';
import { AccessKeyMapper } from './mappers/access-key.mapper';
import { AccessKeyContract } from '../domain/contracts/access-key.contract';


export class AccessKeyRepository extends AccessKeyContract {
  static entity = ACCESS_KEY_ENTITY;

  constructor(
    protected dataSource: DataSource<AccessKeyEntity>,
    protected accessKeyMapper: AccessKeyMapper
  ) {
    super(dataSource, accessKeyMapper);
    this.entity = ACCESS_KEY_ENTITY;
  }
}
