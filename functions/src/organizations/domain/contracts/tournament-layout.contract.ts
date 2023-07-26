import {
  TournamentLayoutEntity
} from '@deporty-org/entities/organizations';
import { GeneralContract } from '../../../core/general-contract';
import { Id } from '@deporty-org/entities';

export interface AccessParams {
  organizationId: string;
  tournamentLayoutId?: Id
}

export abstract class TournamentLayoutContract extends GeneralContract<
  AccessParams,
  TournamentLayoutEntity
> {}
