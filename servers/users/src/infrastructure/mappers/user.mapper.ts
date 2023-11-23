import { UserEntity } from '@deporty-org/entities/users';
import { formatDateFromJson } from '@deporty-org/core';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';

export class UserMapper extends Mapper<UserEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      secondLastName: { name: 'second-last-name' },
      administrationMode: { name: 'administration-mode', default: 'self-managed' },
      firstLastName: { name: 'first-last-name' },
      firstName: { name: 'first-name' },
      secondName: { name: 'second-name' },
      id: { name: 'id' },
      document: { name: 'document' },
      image: {
        name: 'image',
      },
      phone: { name: 'phone' },
      email: { name: 'email' },
      roles: { name: 'roles' },
      birthDate: {
        name: 'birth-date',
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
    };
  }
}
