import { Id } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  intergroupMatchId: Id;
}

export class DeleteIntergroupMatchUsecase extends Usecase<Param, Id> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }
  call(param: Param): Observable<Id> {
    return this.intergroupMatchContract
      .delete(
        {
          fixtureStageId: param.fixtureStageId,
          tournamentId: param.tournamentId,
        },
        param.intergroupMatchId
      )
      .pipe(
        map(() => {
          return param.intergroupMatchId;
        })
      );
  }
}
