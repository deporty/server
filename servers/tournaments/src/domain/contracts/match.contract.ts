import { GeneralContract } from '@deporty-org/core';
import { Id } from '@deporty-org/entities';
import { MatchEntity } from '@deporty-org/entities/tournaments';

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
