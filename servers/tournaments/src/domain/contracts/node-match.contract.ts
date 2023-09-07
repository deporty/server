import { GeneralContract } from '@deporty-org/core';
import { Id } from '@deporty-org/entities';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';

export interface AccessParams {
  tournamentId: Id;
}
export abstract class NodeMatchContract extends GeneralContract<
  AccessParams,
  NodeMatchEntity
> {}
