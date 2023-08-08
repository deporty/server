import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '../../../core/helpers';
import { AccessParams, NodeMatchContract } from '../../domain/contracts/node-match.contract';

import { NodeMatchMapper } from '../mappers/node-match.mapper';

import { MAIN_DRAW_ENTITY, TOURNAMENTS_ENTITY } from '../tournaments.constants';

export class NodeMatchRepository extends NodeMatchContract {
  static entity = MAIN_DRAW_ENTITY;
  constructor(protected dataSource: Firestore, protected groupMapper: NodeMatchMapper) {
    super(dataSource, groupMapper);
  }

  getById(accessParams: AccessParams, id: string): Observable<NodeMatchEntity | undefined> {
    return super.innerGetById([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: MAIN_DRAW_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams): Observable<void> {
    throw new Error('Method not implemented.');
  }
  get(accessParams: AccessParams, pagination?: { pageNumber: number; pageSize: number } | undefined): Observable<NodeMatchEntity[]> {
    return super.innerGet(
      [{ collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId }, { collection: MAIN_DRAW_ENTITY }],
      pagination
    );
  }
  filter(accessParams: AccessParams, filter: Filters): Observable<NodeMatchEntity[]> {
    return super.innerFilter([{ collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId }, { collection: MAIN_DRAW_ENTITY }]);
  }
  update(accessParams: AccessParams, entity: NodeMatchEntity): Observable<void> {
    throw new Error('Method not implemented.');
  }
  save(accessParams: AccessParams, entity: NodeMatchEntity): Observable<string> {
    return super.innerSave([{ collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId }, { collection: MAIN_DRAW_ENTITY }], entity);
  }
}
