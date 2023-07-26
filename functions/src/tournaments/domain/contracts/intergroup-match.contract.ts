import { IntergroupMatchEntity, Id } from '@deporty-org/entities';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  tournamentId: Id;
  fixtureStageId: Id;
}

export abstract class IntergroupMatchContract extends GeneralContract<
  AccessParams,
  IntergroupMatchEntity
> {}
