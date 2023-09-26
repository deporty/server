import { Id, MemberEntity } from '@deporty-org/entities';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { MemberMapper } from '../member.mapper';
import { MEMBERS_ENTITY, TEAMS_ENTITY } from '../teams.constants';
import { AccessParams, MemberContract } from '../../domain/contracts/member.contract';
import { Filters } from '@scifamek-open-source/iraca/domain';

export class MemberRepository extends MemberContract {
  static entity = MEMBERS_ENTITY;

  constructor(protected datasource: Firestore, protected mapper: MemberMapper) {
    super(datasource, mapper);
  }

  delete(accessParams: AccessParams, id: Id): Observable<void> {
    return super.innerDelete([
      { collection: TEAMS_ENTITY, id: accessParams.teamId },
      { collection: MEMBERS_ENTITY, id },
    ]);
  }

  filter(accessParams: AccessParams, filter: Filters): Observable<Array<MemberEntity>> {
    return super.innerFilter([{ collection: TEAMS_ENTITY, id: accessParams.teamId }, { collection: MEMBERS_ENTITY }]);
  }

  get(
    accessParams: any,
    pagination?: {
      pageNumber: number;
      pageSize: number;
    }
  ): Observable<MemberEntity[]> {
    return super.innerGet([{ collection: TEAMS_ENTITY, id: accessParams.teamId }, { collection: MEMBERS_ENTITY }], pagination);
  }

  getById(accessParams: AccessParams, id: Id): Observable<MemberEntity | undefined> {
    return super.innerGetById([
      { collection: TEAMS_ENTITY, id: accessParams.teamId },
      { collection: MEMBERS_ENTITY, id },
    ]);
  }

  save(accessParams: AccessParams, entity: MemberEntity): Observable<string> {
    return super.innerSave([{ collection: TEAMS_ENTITY, id: accessParams.teamId }, { collection: MEMBERS_ENTITY }], entity);
  }

  update(accessParams: AccessParams, entity: MemberEntity): Observable<void> {
    return super.innerUpdate(
      [
        { collection: TEAMS_ENTITY, id: accessParams.teamId },
        { collection: MEMBERS_ENTITY, id: entity.id },
      ],
      entity
    );
  }
}
