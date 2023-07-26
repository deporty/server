import { Id } from '@deporty-org/entities';
import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments';
import { GeneralContract } from '../../../core/general-contract';

export interface AccessParams {
  tournamentId: Id;
  registeredTeamId?: Id;
}
export abstract class RegisteredTeamsContract extends GeneralContract<
  AccessParams,
  RegisteredTeamEntity
> {}
