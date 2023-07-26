import { IScoreModel } from '@deporty-org/entities/tournaments';
import { Mapper } from '../../../core/mapper';

export class ScoreMapper extends Mapper<IScoreModel> {
  constructor() {
    super();
    this.attributesMapper = {
      teamA: { name: 'team-a' },
      teamB: { name: 'team-b' },
    };
  }
}
