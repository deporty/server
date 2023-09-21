import { Id } from '@deporty-org/entities';
import { MemberDescriptionType, MemberEntity } from '@deporty-org/entities/teams';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberContract } from '../../contracts/member.contract';
import { GetMemberByIdUsecase } from '../get-member-by-id/get-member-by-id.usecase';

export interface Param {
  memberId: Id;
  teamId: Id;
  member: MemberEntity;
}

export class EditMemberByIdUsecase extends Usecase<Param, MemberEntity> {
  constructor(private getMemberByIdUsecase: GetMemberByIdUsecase, private memberContract: MemberContract) {
    super();
  }

  call(param: Param): Observable<MemberEntity> {
    const { teamId, memberId, member } = param;
    return this.getMemberByIdUsecase
      .call({
        teamId,
        memberId,
      })
      .pipe(
        mergeMap((memberDescription: MemberDescriptionType) => {
          const newMember: MemberEntity = {
            ...memberDescription.member,
            image: member.image,
            initDate: member.initDate,
            number: member.number,
            position: member.position,
            retirementDate: member.retirementDate,
            kindMember: member.kindMember
          };

          return this.memberContract
            .update(
              {
                teamId,
              },

              newMember
            )
            .pipe(map(() => newMember));
        })
      );
  }
}
