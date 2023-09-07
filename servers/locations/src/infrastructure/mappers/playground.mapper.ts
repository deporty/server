import { PlaygroundEntity } from '@deporty-org/entities/locations';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class PlaygroundMapper extends Mapper<PlaygroundEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      name: { name: 'name' },
    };
  }
}
