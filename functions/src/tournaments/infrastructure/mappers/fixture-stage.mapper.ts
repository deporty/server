import { FixtureStageEntity } from '@deporty-org/entities/tournaments';
import { Mapper } from '../../../core/mapper';

export class FixtureStageMapper extends Mapper<FixtureStageEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      tournamentId: { name: 'tournament-id' },
      order: { name: 'order' },
      id: { name: 'id' },
    };
  }
}
