import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { TransversalContract } from '../../../core/transversal-contract';

export abstract class TournamentContract extends TransversalContract<TournamentEntity> {}
