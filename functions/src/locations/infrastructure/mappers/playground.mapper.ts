import { PlaygroundEntity } from '@deporty-org/entities/locations';
import { Mapper } from '../../../core/mapper';

export class PlaygroundMapper extends Mapper<PlaygroundEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      name: { name: 'name' },
    };
  }
}
