import { Id } from '@deporty-org/entities';
import { GroupEntity } from '@deporty-org/entities/tournaments';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId?: Id;
}

export abstract class GroupContract extends GeneralContract<
  AccessParams,
  GroupEntity
> {}
