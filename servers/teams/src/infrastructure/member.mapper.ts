import { MemberEntity } from '@deporty-org/entities/teams';
import { FileAdapter, Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';

export class MemberMapper extends Mapper<MemberEntity> {
  constructor(private fileAdapter: FileAdapter) {
    super();
    this.attributesMapper = {
      position: { name: 'position', default: '' },
      initDate: {
        name: 'init-date',
        from: (date: Timestamp) => {
          return date ? of(date.toDate()) : of(date);
        },
      },
      number: { name: 'number' },
      retirementDate: {
        name: 'retirement-date',
        from: (date: Timestamp) => {
          return date != null ? of(date.toDate()) : of(date);
        },
      },
      enrollmentDate: {
        name: 'enrollment-date',
        from: (date: Timestamp) => {
          return date != null ? of(date.toDate()) : of(date);
        },
      },
      teamId: { name: 'team-id' },
      image: {
        name: 'image',
        from: (value: string) => {
          return this.fileAdapter.getAbsoluteHTTPUrl(value);
        },
      },
      userId: { name: 'user-id' },
      kindMember: { name: 'kind-member', default: 'player' },
      id: { name: 'id' },
    };
  }
}
