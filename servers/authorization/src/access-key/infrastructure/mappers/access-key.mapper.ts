import { AccessKeyEntity } from '@deporty-org/entities/authorization';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';
export class AccessKeyMapper extends Mapper<AccessKeyEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      id: { name: 'id' },
      name: { name: 'name' },
      description: { name: 'description' },
      key: { name: 'key' },
      expirationDate: {
        name: 'expiration-date',
        from: (date: Timestamp) => (date ? of(date.toDate()) : of(date)),
      },
    };
  }
}
