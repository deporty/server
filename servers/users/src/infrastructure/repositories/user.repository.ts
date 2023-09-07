import { DataSource } from '@scifamek-open-source/iraca/infrastructure';
import { UserContract } from '../../domain/contracts/user.contract';
import { UserMapper } from '../mappers/user.mapper';

export class UserRepository extends UserContract {
  static entity = 'users'
  constructor(
    protected dataSource: DataSource<any>,
    protected mapper: UserMapper
  ) {
    super(dataSource, mapper);
    this.entity = UserRepository.entity;
  }

  
 
}
