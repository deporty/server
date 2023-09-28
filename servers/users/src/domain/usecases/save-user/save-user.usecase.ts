import { UserEntity } from '@deporty-org/entities/users';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { GetUserByUniqueFieldsUsecase } from '../get-user-by-unique-fields/get-user-by-unique-fields.usecase';

export const DEFAULT_ROLE = 'OmUGOqmXbey71Uys1Em2';

export const UserAlreadyExistError = generateError('UserAlreadyExistError', `The user with the document or email address already exists.`);
export const InsuficientUserDataError = generateError('InsuficientUserDataError', `You have to provide the email and document.`);

export class SaveUserUsecase extends Usecase<UserEntity, UserEntity> {
  constructor(private userContract: UserContract, private getUserByUniqueFieldsUsecase: GetUserByUniqueFieldsUsecase) {
    super();
  }

  call(user: UserEntity): Observable<UserEntity> {
    if (!user.email || !user.document) {
      return throwError(new InsuficientUserDataError());
    }
    return this.getUserByUniqueFieldsUsecase
      .call({
        document: user.document,
        email: user.email,
      })
      .pipe(
        mergeMap((prevUser: UserEntity | undefined) => {
          if (prevUser) {
            return throwError(new UserAlreadyExistError());
          }
          const newUser: UserEntity = {
            birthDate: user.birthDate,
            document: user.document,
            email: user.email,
            administrationMode: user.administrationMode,
            phoneExtension: user.phoneExtension ?? '57',
            roles: user.roles ?? [DEFAULT_ROLE],
            firstLastName: user.firstLastName,
            firstName: user.firstName,
            image: user.image,
            phone: user.phone,
            secondLastName: user.secondLastName,
            secondName: user.secondLastName,
          };

          return this.userContract.save(newUser).pipe(map((id) => ({ ...newUser, id })));
        })
      );
  }
}
