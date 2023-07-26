import { FixtureStageEntity, Id } from '@deporty-org/entities';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  tournamentId: Id;
}

export abstract class FixtureStageContract extends GeneralContract<
  AccessParams,
  FixtureStageEntity
> {}
