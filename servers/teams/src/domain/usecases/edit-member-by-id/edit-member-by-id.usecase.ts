import { Id } from '@deporty-org/entities';
import { MemberEntity } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { forceTransformation, getImageExtension } from '@scifamek-open-source/tairona';
import { Observable, from, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { GetOnlyMemberByIdUsecase } from '../get-only-member-by-id/get-only-member-by-id.usecase';

export interface Param {
  memberId: Id;
  teamId: Id;
  member: MemberEntity;
  image?: string;
}

export const UserImageNotAllowedError = generateError('UserImageNotAllowed', `Consider usign a square image`);

export class EditMemberByIdUsecase extends Usecase<Param, MemberEntity> {
  constructor(
    private getOnlyMemberByIdUsecase: GetOnlyMemberByIdUsecase,
    private memberContract: MemberContract,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(param: Param): Observable<MemberEntity> {
    const { teamId, memberId, member } = param;
    return this.getOnlyMemberByIdUsecase
      .call({
        teamId,
        memberId,
      })
      .pipe(
        mergeMap((prevMember: MemberEntity) => {
          if (param.image) {
            const $t = from(
              forceTransformation(param.image, {
                maxAspectRatio: 1.1,
                maxWidth: 300,
              })
            );
            return zip($t, of(prevMember));
          }
          return zip(of(null), of(prevMember));
        }),

        mergeMap(([img, prevMember]) => {
          if (img === undefined) {
            return throwError(new UserImageNotAllowedError());
          }

          if (img !== null) {
            const extension = getImageExtension(img);

            const path = `teams/${param.teamId}/members/${param.memberId}/profile${extension}`;

            return this.fileAdapter.uploadFile(path, img).pipe(
              mergeMap(() => {
                return zip(of(path), of(prevMember));
              })
            );
          }
          return zip(of(prevMember.image), of(prevMember));
        }),
        mergeMap(([path, prevMember]: [string | undefined, MemberEntity]) => {
          const newMember: MemberEntity = {
            ...prevMember,
            initDate: member.initDate,
            number: member.number,
            image: path ? this.fileAdapter.getRelativeUrl(path) : prevMember.image,
            position: member.position,
            retirementDate: member.retirementDate,
            kindMember: member.kindMember,
          };

          return this.memberContract
            .update(
              {
                teamId,
              },
              newMember
            )
            .pipe(
              mergeMap(() => {
                return zip(of(newMember), newMember.image ? this.fileAdapter.getAbsoluteHTTPUrl(path!) : of(newMember.image));
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
