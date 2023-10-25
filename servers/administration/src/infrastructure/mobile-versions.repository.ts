import { MobileVersionEntity } from '@deporty-org/entities';
import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { MobileVersionContract } from '../domain/administration.contract';
import { MobileVersionMapper } from './mobile-versions.mapper';

export class MobileVersionRepository extends MobileVersionContract {
  constructor(protected dataSource: DataSource<MobileVersionEntity>, protected mobileVersionMapper: MobileVersionMapper) {
    super(dataSource, mobileVersionMapper);

    this.entity = 'mobile-versions';
  }
}
