import { DataSource } from '../../../core/datasource';
import { MatchesByRefereeIdContract } from '../../domain/contracts/matches-by-referee-id.contract';
import { TournamentMapper } from '../mappers/tournament.mapper';
import { MATCHES_BY_REFEREE_ID_ENTITY } from '../tournaments.constants';

export class MatchesByRefereeIdRepository extends MatchesByRefereeIdContract {
  static entity = MATCHES_BY_REFEREE_ID_ENTITY;
  constructor(
    protected dataSource: DataSource<any>,
    protected tournamentMapper: TournamentMapper
  ) {
    super(dataSource, tournamentMapper);
    this.entity = MatchesByRefereeIdRepository.entity;
  }
}
