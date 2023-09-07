import { UserEntity } from '@deporty-org/entities/users';
import { TransversalContract } from '@scifamek-open-source/iraca/infrastructure';

export abstract class UserContract extends TransversalContract<UserEntity> {
}
