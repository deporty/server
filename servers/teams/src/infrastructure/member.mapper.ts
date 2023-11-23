import { formatDateFromJson } from '@deporty-org/core';
import { MemberEntity } from '@deporty-org/entities/teams';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';

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
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
      enrollmentDate: {
        name: 'enrollment-date',
        from: (date: Timestamp) => {
          return of(formatDateFromJson(date));
        },
      },
      teamId: { name: 'team-id' },
      image: {
        name: 'image',
      },
      userId: { name: 'user-id' },
      kindMember: { name: 'kind-member', default: 'player' },
      id: { name: 'id' },
    };
  }
}
