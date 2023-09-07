import { GeneralContract } from '@deporty-org/core';
import { MemberEntity } from '@deporty-org/entities/teams';

export interface AccessParams {
  teamId: string;
}
export abstract class MemberContract extends GeneralContract<
  AccessParams,
  MemberEntity
> {}
