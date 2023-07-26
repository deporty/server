import { Id } from '@deporty-org/entities';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '../../../core/helpers';
import { AccessParams, MatchContract } from '../../domain/contracts/match.contract';
import { MatchMapper } from '../mappers/match.mapper';
import {
  FIXTURE_STAGES_ENTITY,
  GROUPS_ENTITY,
  TOURNAMENTS_ENTITY,
  MATCHS_ENTITY,
} from '../tournaments.constants';

export class MatchRepository extends MatchContract {
  constructor(
    protected firestore: Firestore,
    protected matchMapper: MatchMapper
  ) {
    super(firestore, matchMapper);
  }
  getById(
    accessParams: AccessParams,
    id: string
  ): Observable<MatchEntity | undefined> {
    return super.innerGetById([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
      { collection: GROUPS_ENTITY, id: accessParams.groupId },
      { collection: MATCHS_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams, id: Id): Observable<void> {
    return super.innerDelete([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
      { collection: GROUPS_ENTITY, id: accessParams.groupId },
      { collection: MATCHS_ENTITY, id },

    ]);
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number }
  ): Observable<MatchEntity[]> {
    return super.innerGet(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY, id: accessParams.groupId },
        { collection: MATCHS_ENTITY },
      ],
      pagination
    );
  }
  filter(
    accessParams: AccessParams,
    filter: Filters
  ): Observable<MatchEntity[]> {
    return super.innerFilter(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY, id: accessParams.groupId },
        { collection: MATCHS_ENTITY },
      ],
      { filters: filter }
    );
  }
  update(accessParams: AccessParams, entity: MatchEntity): Observable<void> {
    return this.innerUpdate(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY, id: accessParams.groupId },
        { collection: MATCHS_ENTITY, id: accessParams.matchId },

      ],
      entity
    );
  }
  save(accessParams: AccessParams, entity: MatchEntity): Observable<string> {
    return this.innerSave(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY, id: accessParams.groupId },
        { collection: MATCHS_ENTITY },
      ],
      entity
    );
  }
}
