import { PlayerForm } from '@deporty-org/entities';
import { Mapper } from '../../../core/mapper';

export class PlayerFormMapper extends Mapper<PlayerForm> {
  constructor() {
    super();
    this.attributesMapper = {
      teamA: { name: 'team-a' },
      teamB: { name: 'team-b' },
      matchId: { name: 'match-id' },
      id: { name: 'id' },
    };
  }
}

