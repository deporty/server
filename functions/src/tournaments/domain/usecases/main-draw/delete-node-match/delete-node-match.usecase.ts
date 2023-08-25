import { Id } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { NodeMatchContract } from '../../../contracts/node-match.contract';

export interface Param {
  tournamentId: Id;
  nodeMatchId: Id;
}
export class DeleteNodeMatchUsecase extends Usecase<Param, Id> {
  constructor(private nodeMatchContract: NodeMatchContract) {
    super();
  }

  call(param: Param): Observable<Id> {
    return this.nodeMatchContract
      .delete(
        {
          tournamentId: param.tournamentId,
        },
        param.nodeMatchId
      )
      .pipe(
        map(() => {
          return param.nodeMatchId;
        })
      );
  }
}
