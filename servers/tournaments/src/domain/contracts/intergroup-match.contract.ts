import { GeneralContract } from '@deporty-org/core';
import { IntergroupMatchEntity, Id } from '@deporty-org/entities';

export interface AccessParams {
  tournamentId: Id;
  fixtureStageId: Id;
}

export abstract class IntergroupMatchContract extends GeneralContract<
  AccessParams,
  IntergroupMatchEntity
> {}
