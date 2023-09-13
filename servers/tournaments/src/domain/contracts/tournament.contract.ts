import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { TransversalContract } from '@scifamek-open-source/iraca/infrastructure';

export abstract class TournamentContract extends TransversalContract<TournamentEntity> {}
