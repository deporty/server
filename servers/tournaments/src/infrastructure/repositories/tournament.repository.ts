
import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { TournamentContract } from '../../domain/contracts/tournament.contract';
import { TournamentMapper } from '../mappers/tournament.mapper';
import { TOURNAMENTS_ENTITY } from '../tournaments.constants';

export class TournamentRepository extends TournamentContract {
  static entity = TOURNAMENTS_ENTITY;
  constructor(
    protected dataSource: DataSource<any>,
    protected tournamentMapper: TournamentMapper
  ) {
    super(dataSource, tournamentMapper);
    this.entity = TournamentRepository.entity;
  }
}
