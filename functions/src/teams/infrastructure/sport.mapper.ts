import { SportEntity } from '@deporty-org/entities/teams';
import { Mapper } from '../../core/mapper';

export class SportMapper extends Mapper<SportEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      sportsFamilyId: { name: 'sports-family-id' },
      name: { name: 'name' },
      id: { name: 'id' },
    };
  }
}
