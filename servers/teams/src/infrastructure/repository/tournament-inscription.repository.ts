import { TournamentInscriptionEntity } from '@deporty-org/entities';
import { Filters } from '@scifamek-open-source/iraca/domain';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { AccessParams, TournamentInscriptionContract } from '../../domain/contracts/tournament-inscription.contract';
import { TournamentInscriptionMapper } from '../mappers/tournament-inscription.mapper';
import { TEAMS_ENTITY, TOURNAMENT_INSCRIPTIONS_ENTITY } from '../teams.constants';

export class TournamentInscriptionRepository extends TournamentInscriptionContract {
  static entity = TOURNAMENT_INSCRIPTIONS_ENTITY;

  constructor(protected datasource: Firestore, protected mapper: TournamentInscriptionMapper) {
    super(datasource, mapper);
  }

  delete(accessParams: AccessParams, id: string): Observable<void> {
    return super.innerDelete([
      { collection: TEAMS_ENTITY, id: accessParams.teamId },
      { collection: TOURNAMENT_INSCRIPTIONS_ENTITY, id },
    ]);
  }
  filter(accessParams: AccessParams, filter: Filters): Observable<TournamentInscriptionEntity[]> {
    throw new Error('Method not implemented.');
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number } | undefined
  ): Observable<TournamentInscriptionEntity[]> {
    return super.innerGet(
      [{ collection: TEAMS_ENTITY, id: accessParams.teamId }, { collection: TOURNAMENT_INSCRIPTIONS_ENTITY }],
      pagination
    );
  }
  getById(accessParams: AccessParams, id: string): Observable<TournamentInscriptionEntity | undefined> {
    return super.innerGetById([
      { collection: TEAMS_ENTITY, id: accessParams.teamId },
      { collection: TOURNAMENT_INSCRIPTIONS_ENTITY, id: id },
    ]);
  }
  save(accessParams: AccessParams, entity: TournamentInscriptionEntity): Observable<string> {
    return super.innerSave([{ collection: TEAMS_ENTITY, id: accessParams.teamId }, { collection: TOURNAMENT_INSCRIPTIONS_ENTITY }], entity);
  }
  update(accessParams: AccessParams, entity: TournamentInscriptionEntity): Observable<void> {
    return super.innerUpdate(
      [
        { collection: TEAMS_ENTITY, id: accessParams.teamId },
        { collection: TOURNAMENT_INSCRIPTIONS_ENTITY, id: entity.id },
      ],
      entity
    );
  }
}
