import { FixtureStageEntity } from '@deporty-org/entities/tournaments';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '../../../core/helpers';
import {
  AccessParams,
  FixtureStageContract,
} from '../../domain/contracts/fixture-stage.contract';
import { FixtureStageMapper } from '../mappers/fixture-stage.mapper';
import {
  FIXTURE_STAGES_ENTITY,
  MAIN_DRAW_ENTITY,
  TOURNAMENTS_ENTITY,
} from '../tournaments.constants';
import { Id } from '@deporty-org/entities';

export class FixtureStageRepository extends FixtureStageContract {
  static entity = MAIN_DRAW_ENTITY;
  constructor(
    protected dataSource: Firestore,
    protected registeredTeamMapper: FixtureStageMapper
  ) {
    super(dataSource, registeredTeamMapper);
  }

  getById(
    accessParams: AccessParams,
    id: string
  ): Observable<FixtureStageEntity | undefined> {
    return super.innerGetById([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams,  id: Id): Observable<void> {

    return super.innerDelete([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id },
    ]);
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number } | undefined
  ): Observable<FixtureStageEntity[]> {
    return super.innerGet(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY },
      ],
      pagination
    );
  }
  filter(
    accessParams: AccessParams,
    filters: Filters
  ): Observable<FixtureStageEntity[]> {
    return super.innerFilter(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY },
      ],
      { filters }
    );
  }
  update(
    accessParams: AccessParams,
    entity: FixtureStageEntity
  ): Observable<void> {
    throw new Error('Method not implemented.');
  }
  save(
    accessParams: AccessParams,
    entity: FixtureStageEntity
  ): Observable<string> {
    return super.innerSave(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY },
      ],
      entity
    );
  }
}
