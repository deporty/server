import { ResourceEntity } from '@deporty-org/entities/authorization';
import { TransversalContract } from '@scifamek-open-source/iraca/infrastructure';

export abstract class ResourceContract extends TransversalContract<ResourceEntity> {}
