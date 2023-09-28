import { UserEntity } from '@deporty-org/entities/users';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { forceTransformation, getImageExtension } from '@scifamek-open-source/tairona';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { GetUserByIdUsecase } from '../get-user-by-id/get-user-by-id.usecase';

export interface Param {
  user: UserEntity;
  image: string;
}

export const UserImageNotAllowed = generateError('UserImageNotAllowed', `Consider usign a square image`);

export class EditUserByIdUsecase extends Usecase<Param, UserEntity> {
  constructor(private userContract: UserContract, private getUserByIdUsecase: GetUserByIdUsecase, private fileAdapter: FileAdapter) {
    super();
  }

  call(param: Param): Observable<UserEntity> {
    const user = param.user;

    return this.getUserByIdUsecase.call(user.id!).pipe(
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
          return throwError(new UserImageNotAllowed());
        }

        let imgToSave = user.image;
        if (img !== null) {
          const extension = getImageExtension(img);

          const path = `users/${prevUser.id}/profile.${extension}`;

          return this.fileAdapter.uploadFile(path, img).pipe(
            mergeMap(() => {
              return zip(of(path), of(prevUser));
            })
          );
        }
        return zip(of(imgToSave), of(prevUser));
      }),
      mergeMap(([path, prevUser]: [string, UserEntity]) => {
        const newUser: UserEntity = {
          ...prevUser,
          birthDate: user.birthDate,
          document: user.document,
          firstLastName: user.firstLastName,
          firstName: user.firstName,
          image: this.fileAdapter.getRelativeUrl(path),
          phone: user.phone,
          secondLastName: user.secondLastName,
          secondName: user.secondLastName,
        };
        return this.userContract.update(prevUser.id!, newUser);
      })
    );
  }
}
