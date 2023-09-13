import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { of } from 'rxjs';
import { FileAdapter, Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class OrganizationMapper extends Mapper<OrganizationEntity> {
  constructor(private fileAdapter: FileAdapter) {
    super();
    this.attributesMapper = {
      FMTA: { name: 'FMTA' },
      NTP: { name: 'NTP' },
      members: { name: 'members' },
      name: { name: 'name' },
      businessName: { name: 'business-name' },
      iso: {
        name: 'iso',
        from: (value: string) => {
          return value
            ? this.fileAdapter.getAbsoluteHTTPUrl(value)
            : of(undefined);
        },
      },
      id: { name: 'id' },
    };
  }
}
