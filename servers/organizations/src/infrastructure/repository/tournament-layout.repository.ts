import { Id } from '@deporty-org/entities';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { ORGANIZATIONS_ENTITY, TOURNAMENT_LAYOUTS_ENTITY } from '../organizations.constants';
import { AccessParams, TournamentLayoutContract } from '../../domain/contracts/tournament-layout.contract';
import { TournamentLayoutMapper } from '../mappers/tournament-layout.mapper';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Filters } from '@scifamek-open-source/iraca/domain';

export class TournamentLayoutsRepository extends TournamentLayoutContract {
  static entity = TOURNAMENT_LAYOUTS_ENTITY;
  constructor(protected datasource: Firestore, protected mapper: TournamentLayoutMapper) {
    super(datasource, mapper);
  }

  getById(accessParams: AccessParams, id: Id): Observable<TournamentLayoutEntity | undefined> {
    return super.innerGetById([
      { collection: ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
      { collection: TOURNAMENT_LAYOUTS_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams): Observable<void> {
    throw new Error('Method not implemented.');
  }
  get(
    accessParams: any,
    pagination?: {
      pageNumber: number;
      pageSize: number;
    }
  ): Observable<TournamentLayoutEntity[]> {
    return super.innerGet(
      [{ collection: ORGANIZATIONS_ENTITY, id: accessParams.organizationId }, { collection: TOURNAMENT_LAYOUTS_ENTITY }],
      pagination
    );
  }

  filter(accessParams: AccessParams, filter: Filters): Observable<Array<TournamentLayoutEntity>> {
    return super.innerFilter(
      [{ collection: ORGANIZATIONS_ENTITY, id: accessParams.organizationId }, { collection: TOURNAMENT_LAYOUTS_ENTITY }],
      {
        filters: filter,
      }
    );
  }

  update(accessParams: AccessParams, entity: TournamentLayoutEntity): Observable<void> {
    return super.innerUpdate(
      [
        { collection: ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
        { collection: TOURNAMENT_LAYOUTS_ENTITY, id: accessParams.tournamentLayoutId },
      ],
      entity
    );
  }
  save(accessParams: AccessParams, entity: TournamentLayoutEntity): Observable<string> {
    return super.innerSave(
      [{ collection: ORGANIZATIONS_ENTITY, id: accessParams.organizationId }, { collection: TOURNAMENT_LAYOUTS_ENTITY }],
      entity
    );
  }
}
