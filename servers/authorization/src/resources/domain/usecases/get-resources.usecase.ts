import { ResourceEntity } from '@deporty-org/entities/authorization';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { ResourceContract } from '../resource.contract';


export class GetResourcesUsecase extends Usecase<string, ResourceEntity[]> {
  constructor(private resourceContract: ResourceContract) {
    super();
  }

  call(): Observable<ResourceEntity[]> {
    return this.resourceContract.get();
  }
}
