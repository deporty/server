import { DataSource } from '../../../core/datasource';
import { PlayerContract } from '../../player.contract';
import { PLAYER_ENTITY } from '../player.constants';
import { PlayerMapper } from '../player.mapper';

export class PlayerRepository extends PlayerContract {
  static entity = PLAYER_ENTITY;
  constructor(
    protected dataSource: DataSource<any>,
    protected playerMapper: PlayerMapper
  ) {
    super(dataSource, playerMapper);
  }
}
