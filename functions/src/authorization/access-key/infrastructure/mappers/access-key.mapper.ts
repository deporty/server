import { AccessKeyEntity } from '@deporty-org/entities/authorization';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';
import { Mapper } from '../../../../core/mapper';
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
