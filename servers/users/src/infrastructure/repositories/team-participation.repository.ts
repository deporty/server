import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '@scifamek-open-source/iraca/domain';

import { Id, TeamParticipationEntity } from '@deporty-org/entities';
import { AccessParams, TeamParticipationContract } from '../../domain/contracts/team-participation.contract';
import { TEAM_PARTICIPATIONS_ENTITY, USERS_ENTITY } from '../users.constants';
import { TeamParticipationMapper } from '../mappers/team-participation.mapper';

export class TeamParticipationRepository extends TeamParticipationContract {
  static entity = TEAM_PARTICIPATIONS_ENTITY;
  constructor(protected dataSource: Firestore, protected teamParticipationMapper: TeamParticipationMapper) {
    super(dataSource, teamParticipationMapper);
  }

  getById(accessParams: AccessParams, id: string): Observable<TeamParticipationEntity | undefined> {
    return super.innerGetById([
      { collection: USERS_ENTITY, id: accessParams.userId },
      { collection: TEAM_PARTICIPATIONS_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams, id: Id): Observable<void> {
    return super.innerDelete([
      { collection: USERS_ENTITY, id: accessParams.userId },
      { collection: TEAM_PARTICIPATIONS_ENTITY, id },
    ]);
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number } | undefined
  ): Observable<TeamParticipationEntity[]> {
    return super.innerGet([{ collection: USERS_ENTITY, id: accessParams.userId }, { collection: TEAM_PARTICIPATIONS_ENTITY }], pagination);
  }
  filter(accessParams: AccessParams, filters: Filters): Observable<TeamParticipationEntity[]> {
    return super.innerFilter([{ collection: USERS_ENTITY, id: accessParams.userId }, { collection: TEAM_PARTICIPATIONS_ENTITY }], {
      filters,
    });
  }
  update(accessParams: AccessParams, entity: TeamParticipationEntity): Observable<void> {
    return super.innerUpdate(
      [
        { collection: USERS_ENTITY, id: accessParams.userId },
        { collection: TEAM_PARTICIPATIONS_ENTITY, id: entity.id },
      ],
      entity
    );
  }
  save(accessParams: AccessParams, entity: TeamParticipationEntity): Observable<string> {
    return super.innerSave([{ collection: USERS_ENTITY, id: accessParams.userId }, { collection: TEAM_PARTICIPATIONS_ENTITY }], entity);
  }
}
