import { FixtureStageEntity } from '@deporty-org/entities/tournaments';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

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
