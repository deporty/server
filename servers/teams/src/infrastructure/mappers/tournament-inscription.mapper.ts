import { MemberEntity, TournamentInscriptionEntity } from '@deporty-org/entities/teams';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { Timestamp } from 'firebase-admin/firestore';
import { of, zip } from 'rxjs';
import { MemberMapper } from '../member.mapper';

export class TournamentInscriptionMapper extends Mapper<TournamentInscriptionEntity> {
  constructor(private memberMapper: MemberMapper) {
    super();
    this.attributesMapper = {
      tournamentId: { name: 'tournament-id' },
      id: { name: 'id' },
      requiredDocs: { name: 'required-docs' },

      enrollmentDate: {
        name: 'enrollment-date',
        from: (date: Timestamp) => {
          return date ? of(date.toDate()) : of(undefined);
        },
      },
      members: {
        name: 'members',

        from: (members: Array<any>) => {
          return members.length > 0
            ? zip(
                ...members.map((element) => {
                  return this.memberMapper.fromJson(element);
                })
              )
            : of([]);
        },
        to: (members: Array<MemberEntity>) => {
          return members.length > 0
            ? members.map((element) => {
                return this.memberMapper.toJson(element);
              })
            : [];
        },
      },

      teamId: { name: 'team-id' },
      status: { name: 'status' },
    };
  }
}
