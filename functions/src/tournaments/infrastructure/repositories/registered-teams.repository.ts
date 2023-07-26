import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments';
import { Firestore } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';
import { Filters } from '../../../core/helpers';
import { AccessParams } from '../../domain/contracts/registered-teams.contract';
import { RegisteredTeamsContract } from '../../domain/contracts/registered-teams.contract';
import { RegisteredTeamMapper } from '../mappers/registered-teams.mapper';
import { REGISTERED_TEAMS_ENTITY, TOURNAMENTS_ENTITY } from '../tournaments.constants';
import { Id } from '@deporty-org/entities';

export class RegisteredTeamsRepository extends RegisteredTeamsContract {
  static entity = REGISTERED_TEAMS_ENTITY;
  constructor(
    protected dataSource: Firestore,
    protected registeredTeamMapper: RegisteredTeamMapper
  ) {
    super(dataSource, registeredTeamMapper);
  }

  getById(
    accessParams: AccessParams,
    id: string
  ): Observable<RegisteredTeamEntity | undefined> {
    return super.innerGetById([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: REGISTERED_TEAMS_ENTITY, id },
    ]);
  }
  delete(accessParams: AccessParams,  id: Id): Observable<void> {

    return super.innerDelete([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: REGISTERED_TEAMS_ENTITY, id },
    ]);
  }
  get(
    accessParams: AccessParams,
    pagination?: { pageNumber: number; pageSize: number } | undefined
  ): Observable<RegisteredTeamEntity[]> {
    return super.innerGet(
      [
        { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
        { collection: REGISTERED_TEAMS_ENTITY },
      ],
      pagination
    );
  }
  filter(
    accessParams: AccessParams,
    filter: Filters
  ): Observable<RegisteredTeamEntity[]> {
    return super.innerFilter([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: REGISTERED_TEAMS_ENTITY },
    ]);
  }
  update(
    accessParams: AccessParams,
    entity: RegisteredTeamEntity
  ): Observable<void> {
    return super.innerUpdate([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: REGISTERED_TEAMS_ENTITY, id: entity.id},
    ], entity);
  }
  save(
    accessParams: AccessParams,
    entity: RegisteredTeamEntity
  ): Observable<string> {
    return super.innerSave([
      { collection: TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
      { collection: REGISTERED_TEAMS_ENTITY },
    ], entity);
  }
}
