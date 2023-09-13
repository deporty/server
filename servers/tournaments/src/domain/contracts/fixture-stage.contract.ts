import { GeneralContract } from '@deporty-org/core';
import { FixtureStageEntity, Id } from '@deporty-org/entities';

export interface AccessParams {
  tournamentId: Id;
}

export abstract class FixtureStageContract extends GeneralContract<
  AccessParams,
  FixtureStageEntity
> {}
