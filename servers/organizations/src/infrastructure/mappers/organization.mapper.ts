import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class OrganizationMapper extends Mapper<OrganizationEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      FMTA: { name: 'FMTA' },
      NTP: { name: 'NTP' },
      members: { name: 'members' },
      name: { name: 'name' },
      status: { name: 'status', default: 'active' },
      businessName: { name: 'business-name' },
      iso: {
        name: 'iso',
      },
      id: { name: 'id' },
    };
  }
}
