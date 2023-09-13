import { GeneralContract } from '@deporty-org/core';
import { Id } from '@deporty-org/entities';
import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments';

export interface AccessParams {
  tournamentId: Id;
  registeredTeamId?: Id;
}
export abstract class RegisteredTeamsContract extends GeneralContract<
  AccessParams,
  RegisteredTeamEntity
> {}
