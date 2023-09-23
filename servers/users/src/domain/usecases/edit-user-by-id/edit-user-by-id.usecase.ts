import { UserEntity } from '@deporty-org/entities/users';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { GetUserByIdUsecase } from '../get-user-by-id/get-user-by-id.usecase';


export class EditUserByIdUsecase extends Usecase<UserEntity, UserEntity> {
  constructor(private userContract: UserContract, private getUserByIdUsecase: GetUserByIdUsecase) {
    super();
  }

  call(user: UserEntity): Observable<UserEntity> {
    return this.getUserByIdUsecase.call(user.id!).pipe(
      mergeMap((prevUser: UserEntity) => {
        const newUser: UserEntity = {
          ...prevUser,
          birthDate: user.birthDate,
          document: user.document,
          firstLastName: user.firstLastName,
          firstName: user.firstName,
          image: user.image,
          phone: user.phone,
          secondLastName: user.secondLastName,
          secondName: user.secondLastName,
        };

        return this.userContract.update(prevUser.id!, newUser);
      })
    );
  }
}
