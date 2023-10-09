import { MemberEntity } from '@deporty-org/entities/teams';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { formatDateFromJson } from '@deporty-org/core';

export class MemberMapper extends Mapper<MemberEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      position: { name: 'position', default: '' },
      initDate: {
        name: 'init-date',
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
      number: { name: 'number' },
      retirementDate: {
        name: 'retirement-date',
        default: null,
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
      teamId: { name: 'team-id' },
      userId: { name: 'user-id' },
      kindMember: {
        name: 'kind-member',
        default: 'player',
        // from: (kindMember: any) => {
        //   if (Array.isArray(kindMember)) {
        //     if (kindMember.length == 0) {
        //       return 'player';
        //     }else {

        //       return zip(kindMember.map((kindMember) => kindMember))
        //     }
        //   }
        // },
      },
      id: {
        name: 'id',
      },
    };
  }
}
