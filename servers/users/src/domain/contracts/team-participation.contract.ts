import { GeneralContract } from '@deporty-org/core';
import { Id } from '@deporty-org/entities';
import { TeamParticipationEntity } from '@deporty-org/entities';

export interface AccessParams {
  userId: Id;
}
export abstract class TeamParticipationContract extends GeneralContract<AccessParams, TeamParticipationEntity> {}
