import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { SportContract } from '../../domain/contracts/sport.contract';
import { SportMapper } from '../sport.mapper';
import { SPORTS_ENTITY } from '../teams.constants';

export class SportRepository extends SportContract {
  constructor(
    protected dataSource: DataSource<any>,
    protected mapper: SportMapper
  ) {
    super(dataSource, mapper);
    this.entity = SPORTS_ENTITY;
  }
}
