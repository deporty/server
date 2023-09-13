import { GeneralContract } from '@deporty-org/core';
import { Id } from '@deporty-org/entities';
import { GroupEntity } from '@deporty-org/entities/tournaments';

export interface AccessParams {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId?: Id;
}

export abstract class GroupContract extends GeneralContract<
  AccessParams,
  GroupEntity
> {}
