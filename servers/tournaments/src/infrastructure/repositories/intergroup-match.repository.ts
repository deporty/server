import { IntergroupMatchEntity } from '@deporty-org/entities/tournaments';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '@scifamek-open-source/iraca/domain';

import {
  FIXTURE_STAGES_ENTITY,
  INTERGROUP_MATCHES_ENTITY,
  TOURNAMENTS_ENTITY,
} from '../tournaments.constants';
import { Id } from '@deporty-org/entities';
import {
  AccessParams,
  IntergroupMatchContract,
} from '../../domain/contracts/intergroup-match.contract';
import { IntergroupMatchMapper } from '../mappers/intergroup-match.mapper';

export class IntergroupMatchRepository extends IntergroupMatchContract {
  static entity = INTERGROUP_MATCHES_ENTITY;
  constructor(
    protected dataSource: Firestore,
    protected intergroupMatchMapper: IntergroupMatchMapper
  ) {
    super(dataSource, intergroupMatchMapper);
  }

  getById(
    accessParams: AccessParams,
    id: string
  ): Observable<IntergroupMatchEntity | undefined> {
    return super.innerGetById([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
      { collection: INTERGROUP_MATCHES_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams, id: Id): Observable<void> {
    return super.innerDelete([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
      { collection: INTERGROUP_MATCHES_ENTITY, id },
    ]);
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number } | undefined
  ): Observable<IntergroupMatchEntity[]> {
    return super.innerGet(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: INTERGROUP_MATCHES_ENTITY },
      ],
      pagination
    );
  }
  filter(
    accessParams: AccessParams,
    filters: Filters
  ): Observable<IntergroupMatchEntity[]> {
    return super.innerFilter(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: INTERGROUP_MATCHES_ENTITY },
      ],
      { filters }
    );
  }
  update(
    accessParams: AccessParams,
    entity: IntergroupMatchEntity
  ): Observable<void> {

    return super.innerUpdate(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: INTERGROUP_MATCHES_ENTITY, id: entity.id },
      ],
      entity
    );
    
  }
  save(
    accessParams: AccessParams,
    entity: IntergroupMatchEntity
  ): Observable<string> {
    return super.innerSave(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: INTERGROUP_MATCHES_ENTITY },
      ],
      entity
    );
  }
}
