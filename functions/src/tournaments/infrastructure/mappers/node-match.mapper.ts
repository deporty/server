import { MatchEntity, NodeMatchEntity } from '@deporty-org/entities';
import { Mapper } from '../../../core/mapper';
import { MatchMapper } from './match.mapper';

export class NodeMatchMapper extends Mapper<NodeMatchEntity> {
  constructor(private matchMapper: MatchMapper) {
    super();
    this.attributesMapper = {
      key: { name: 'key' },
      id: { name: 'id' },
      level: { name: 'level' },
      match: {
        name: 'match',
        from: (value: any) => {
          return this.matchMapper.fromJson(value);
        },
        to: (value: MatchEntity) => {
          return this.matchMapper.toJson(value);
        },
      },
    };
  }
}
