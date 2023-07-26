import { Id } from '@deporty-org/entities';
import { GroupEntity } from '@deporty-org/entities/tournaments';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '../../../core/helpers';
import { AccessParams, GroupContract } from '../../domain/contracts/group.contract';
import { GroupMapper } from '../mappers/group.mapper';
import {
  FIXTURE_STAGES_ENTITY,
  GROUPS_ENTITY,
  TOURNAMENTS_ENTITY,
} from '../tournaments.constants';

export class GroupRepository extends GroupContract {
  constructor(
    protected firestore: Firestore,
    protected groupMapper: GroupMapper
  ) {
    super(firestore, groupMapper);
  }
  getById(
    accessParams: AccessParams,
    id: string
  ): Observable<GroupEntity | undefined> {
    return super.innerGetById([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
      { collection: GROUPS_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams, id: Id): Observable<void> {
    return super.innerDelete([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
      { collection: GROUPS_ENTITY, id },
    ]);
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number }
  ): Observable<GroupEntity[]> {
    return super.innerGet(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY },
      ],
      pagination
    );
  }
  filter(
    accessParams: AccessParams,
    filter: Filters
  ): Observable<GroupEntity[]> {
    return super.innerFilter(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY },
      ],
      { filters: filter }
    );
  }
  update(accessParams: AccessParams, entity: GroupEntity): Observable<void> {
    return this.innerUpdate(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY, id: accessParams.groupId },
      ],
      entity
    );
  }
  save(accessParams: AccessParams, entity: GroupEntity): Observable<string> {
    return this.innerSave(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
        { collection: GROUPS_ENTITY },
      ],
      entity
    );
  }
}
