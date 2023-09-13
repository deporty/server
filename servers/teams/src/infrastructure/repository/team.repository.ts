import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { TeamContract } from '../../domain/contracts/team.contract';
import { TEAMS_ENTITY } from '../teams.constants';
import { TeamMapper } from '../team.mapper';

export class TeamRepository extends TeamContract {
  constructor(
    protected dataSource: DataSource<any>,
    protected mapper: TeamMapper
  ) {
    super(dataSource, mapper);
    this.entity = TEAMS_ENTITY;
  }
}
