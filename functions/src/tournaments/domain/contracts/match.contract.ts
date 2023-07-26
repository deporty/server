import { Id } from '@deporty-org/entities';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
  matchId?: Id;
}

export abstract class MatchContract extends GeneralContract<
  AccessParams,
  MatchEntity
> {}
