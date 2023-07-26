import { UserEntity } from '@deporty-org/entities/users';
import { Mapper } from '../../../core/mapper';
import { FileAdapter } from '../../../core/file/file.adapter';

export class UserMapper extends Mapper<UserEntity> {
  constructor(private fileAdapter: FileAdapter) {
    super();
    this.attributesMapper = {
      secondLastName: { name: 'second-last-name' },
      firstLastName: { name: 'first-last-name' },
      firstName: { name: 'first-name' },
      secondName: { name: 'second-name' },
      id: { name: 'id' },
      document: { name: 'document' },
      image: {
        name: 'image',
        from: (value: string) => {
          return this.fileAdapter.getAbsoluteHTTPUrl(value);
        },
      },
      phone: { name: 'phone' },
      email: { name: 'email' },
      roles: { name: 'roles' },
      birthDate: { name: 'birth-date' },
    };
  }
}
