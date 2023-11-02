import { Id, IntergroupMatchEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';

export class IntergroupMatchDoesNotExistError extends Error {
  constructor(id: string) {
    super();
    this.message = `The Match with the id ${id} does not exist`;
    this.name = 'IntergroupMatchDoesNotExistError';
  }
}

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  intergroupMatchId: Id;
}

export class GetIntergroupMatchByIdUsecase extends Usecase<Param, IntergroupMatchEntity> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }

  call(param: Param): Observable<IntergroupMatchEntity> {
    return this.intergroupMatchContract
      .getById(
        {
          fixtureStageId: param.fixtureStageId,
          tournamentId: param.tournamentId,
        },
        param.intergroupMatchId
      )
      .pipe(
        mergeMap((match: IntergroupMatchEntity | undefined) => {
          if (!match) {
            return throwError(new IntergroupMatchDoesNotExistError(param.intergroupMatchId));
          }
          return of(match);
        })
      );
  }
}
