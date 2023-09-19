import { GeneralContract } from '@deporty-org/core';
import { TournamentInscriptionEntity } from '@deporty-org/entities/teams';

export interface AccessParams {
  teamId: string;
}
export abstract class TournamentInscriptionContract extends GeneralContract<AccessParams, TournamentInscriptionEntity> {}
