import { Id } from '@deporty-org/entities';
import { GroupEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Usecase } from '../../../../../core/usecase';
import { GroupContract } from '../../../contracts/group.contract';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
}

export class GetGroupsByFixtureStageUsecase extends Usecase<
  Param,
  GroupEntity[]
> {
  constructor(private groupContract: GroupContract) {
    super();
  }

  call(param: Param): Observable<GroupEntity[]> {
    return this.groupContract.get({
      tournamentId: param.tournamentId,
      fixtureStageId: param.fixtureStageId,
    });
  }
}
