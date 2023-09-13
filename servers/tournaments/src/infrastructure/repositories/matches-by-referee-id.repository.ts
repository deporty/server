import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { MatchesByRefereeIdContract } from '../../domain/contracts/matches-by-referee-id.contract';
import { MatchesByRefereeIdMapper } from '../mappers/matches-by-referee-id.mapper';
import { MATCHES_BY_REFEREE_ID_ENTITY } from '../tournaments.constants';
import { MatchesByRefereeIdEntity} from '@deporty-org/entities'

export class MatchesByRefereeIdRepository extends MatchesByRefereeIdContract {
  static entity = MATCHES_BY_REFEREE_ID_ENTITY;
  constructor(
    protected dataSource: DataSource<MatchesByRefereeIdEntity>,
    protected matchesByRefereeIdMapper: MatchesByRefereeIdMapper
  ) {
    super(dataSource, matchesByRefereeIdMapper);
    this.entity = MatchesByRefereeIdRepository.entity;
  }
}
