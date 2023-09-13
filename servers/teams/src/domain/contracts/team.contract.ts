import { TeamEntity } from '@deporty-org/entities/teams';
import { TransversalContract } from '@scifamek-open-source/iraca/infrastructure';

export abstract class TeamContract extends TransversalContract<TeamEntity> {}
