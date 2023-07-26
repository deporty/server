import { IPlayerModel } from '@deporty-org/entities/players';
import { Mapper } from '../../core/mapper';

export class PlayerMapper extends Mapper<IPlayerModel> {
  constructor() {
    super();
    this.attributesMapper = {
      name: { name: 'name' },
      lastName: { name: 'last-name' },
      id: { name: 'id' },
      document: { name: 'document' },
      image: { name: 'image' },
      phone: { name: 'phone' },
      email: { name: 'email' },
      roles: { name: 'roles' },
      birthDate: { name: 'birth-date' },
    };
  }
}
