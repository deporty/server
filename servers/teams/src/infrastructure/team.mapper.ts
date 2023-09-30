import { TeamEntity } from '@deporty-org/entities/teams';
import { FileAdapter, Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class TeamMapper extends Mapper<TeamEntity> {
  constructor(private fileAdapter: FileAdapter) {
    super();
    this.attributesMapper = {
      name: { name: 'name' },
      id: { name: 'id' },
      status: { name: 'status', default: 'enabled' },
      athem: { name: 'athem' },
      category: { name: 'category' },
      city: { name: 'city' },
      sportIds: { name: 'sport-ids' },
      miniShield: {
        name: 'mini-shield',
        from: (value: string) => {
          return this.fileAdapter.getAbsoluteHTTPUrl(value);
        },
      },

      shield: {
        name: 'shield',
        from: (value: string) => {
          return this.fileAdapter.getAbsoluteHTTPUrl(value);
        },
      },
    };
  }
}
