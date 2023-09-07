import {
  TournamentLayoutEntity
} from '@deporty-org/entities/organizations';
import { Id } from '@deporty-org/entities';
import { GeneralContract } from '@deporty-org/core';

export interface AccessParams {
  organizationId: string;
  tournamentLayoutId?: Id
}

export abstract class TournamentLayoutContract extends GeneralContract<
  AccessParams,
  TournamentLayoutEntity
> {}
