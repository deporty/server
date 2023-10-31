import {
  IntergroupMatchEntity,
  MatchEntity,
} from '@deporty-org/entities/tournaments';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { MatchMapper } from './match.mapper';

export class IntergroupMatchMapper extends Mapper<IntergroupMatchEntity> {
  constructor(private matchMapper: MatchMapper) {
    super();
    this.attributesMapper = {
      fixtureStageId: { name: 'fixture-stage-id' },
      teamAGroupId: { name: 'team-a-group-id' },
      teamBGroupId: { name: 'team-b-group-id' },
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
