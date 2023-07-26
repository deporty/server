import { MemberEntity } from '@deporty-org/entities/teams';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  teamId: string;
}
export abstract class MemberContract extends GeneralContract<
  AccessParams,
  MemberEntity
> {}
