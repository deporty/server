import { TeamParticipationEntity } from '@deporty-org/entities/users';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of } from 'rxjs';

export class TeamParticipationMapper extends Mapper<TeamParticipationEntity> {
  constructor() {
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
      userId: { name: 'user-id' },
      kindMember: { name: 'kind-member', default: 'player' },
      id: { name: 'id' },
    };
  }
}
