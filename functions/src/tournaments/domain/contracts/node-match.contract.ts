import { Id } from '@deporty-org/entities';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  tournamentId: Id;
}
export abstract class NodeMatchContract extends GeneralContract<
  AccessParams,
  NodeMatchEntity
> {}
