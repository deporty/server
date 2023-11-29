import { PlayerForm } from '@deporty-org/entities';
import { PlayersInMatchData } from '@deporty-org/entities/tournaments/player-form.entity';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

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

export class PlayersInMatchDataMapper extends Mapper<PlayersInMatchData> {
  constructor() {
    super();
    this.attributesMapper = {
      teamA: { name: 'team-a' },
      teamB: { name: 'team-b' },
    };
  }
}
