import { IScoreModel } from '@deporty-org/entities/tournaments';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class ScoreMapper extends Mapper<IScoreModel> {
  constructor() {
    super();
    this.attributesMapper = {
      teamA: { name: 'team-a' },
      teamB: { name: 'team-b' },
    };
  }
}
