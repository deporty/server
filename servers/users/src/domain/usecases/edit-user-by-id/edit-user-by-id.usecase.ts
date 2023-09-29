import { UserEntity } from '@deporty-org/entities/users';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { forceTransformation, getImageExtension } from '@scifamek-open-source/tairona';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { GetUserByIdUsecase } from '../get-user-by-id/get-user-by-id.usecase';
import { Id } from '@deporty-org/entities';

export interface Param {
  user: UserEntity;
  id: Id;
  image?: string;
}

export const UserImageNotAllowedError = generateError('UserImageNotAllowed', `Consider usign a square image`);

export class EditUserByIdUsecase extends Usecase<Param, UserEntity> {
  constructor(private userContract: UserContract, private getUserByIdUsecase: GetUserByIdUsecase, private fileAdapter: FileAdapter) {
    super();
  }

  call(param: Param): Observable<UserEntity> {
    const user = param.user;

    return this.getUserByIdUsecase.call(param.id).pipe(
      mergeMap((prevUser: UserEntity) => {
        if (param.image) {
          const $t = from(
            forceTransformation(param.image, {
              maxAspectRatio: 1.1,
              maxWidth: 300,
            })
          );
          return zip($t, of(prevUser));
        }
        return zip(of(null), of(prevUser));
      }),
      mergeMap(([img, prevUser]) => {
        if (img === undefined) {
          return throwError(new UserImageNotAllowedError());
        }

        if (img !== null) {
          const extension = getImageExtension(img);

          const path = `users/${prevUser.id}/profile${extension}`;

          return this.fileAdapter.uploadFile(path, img).pipe(
            mergeMap(() => {
              return zip(of(path), of(prevUser));
            })
          );
        }
        return zip(of(prevUser.image), of(prevUser));
      }),
      mergeMap(([path, prevUser]: [string, UserEntity]) => {
        const newUser: UserEntity = {
          ...prevUser,
          birthDate: user.birthDate,
          document: user.document,
          firstLastName: user.firstLastName,
          firstName: user.firstName,
          image: path ? this.fileAdapter.getRelativeUrl(path) : prevUser.image,
          phone: user.phone,
          secondLastName: user.secondLastName,
          secondName: user.secondName,
        };
        return this.userContract.update(prevUser.id!, newUser).pipe(
          mergeMap((user) => {
            return zip(of(user), user.image ? this.fileAdapter.getAbsoluteHTTPUrl(path) : of(''));
          }),
          map(([user, path]) => {
            return {
              ...user,

              image: path,
            };
          })
        );
      })
    );
  }
}
