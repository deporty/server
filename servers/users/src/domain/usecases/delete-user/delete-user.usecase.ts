import { UserEntity } from '@deporty-org/entities/users';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { GetUserByIdUsecase } from '../get-user-by-id/get-user-by-id.usecase';


export const UserIsSelfManagedError = generateError('UserIsSelfManagedError', `The user can be deleted because it is self managed.`);

export class DeleteUserUsecase extends Usecase<string, boolean> {
  constructor(private getUserByIdUsecase: GetUserByIdUsecase, private userContract: UserContract, private fileAdapter: FileAdapter) {
    super();
  }

  call(userId: string): Observable<boolean> {
    return this.getUserByIdUsecase.call(userId).pipe(
      mergeMap((user: UserEntity) => {
        if (user.administrationWay == 'self-managed') {
          return throwError(new UserIsSelfManagedError());
        }
        let $image = of(null);
        if (user.image) {
          $image = this.fileAdapter.deleteFile(user.image);
        }
        return $image;
      }),
      mergeMap(() => {
        return this.userContract.delete(userId).pipe(map((user) => true));
      })
    );
  }
}
