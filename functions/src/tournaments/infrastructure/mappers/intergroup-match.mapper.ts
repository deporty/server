import {
  IntergroupMatchEntity,
  MatchEntity,
} from '@deporty-org/entities/tournaments';
import { Mapper } from '../../../core/mapper';
import { MatchMapper } from './match.mapper';

export class IntergroupMatchMapper extends Mapper<IntergroupMatchEntity> {
  constructor(private matchMapper: MatchMapper) {
    super();
    this.attributesMapper = {
      fixtureStageId: { name: 'fixture-stage-id' },
      match: {
        name: 'match',
        from: (val: any) => {
          return this.matchMapper.fromJson(val);
        },
        to: (match: MatchEntity) => {
          return this.matchMapper.toJson(match);
        },
      },
      id: { name: 'id' },
    };
  }
}
