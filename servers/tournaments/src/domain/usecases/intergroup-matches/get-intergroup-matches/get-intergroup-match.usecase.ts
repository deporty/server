import { Id } from '@deporty-org/entities';
import {
  MatchStatusType,
  IntergroupMatchEntity,
} from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';

export interface Param {
  fixtureStageId: Id;
  states: MatchStatusType[];
  tournamentId: Id;
}

export class GetIntergroupMatchesUsecase extends Usecase<
  Param,
  IntergroupMatchEntity[]
> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }

  call(param: Param): Observable<IntergroupMatchEntity[]> {
    return this.intergroupMatchContract
      .get({
        fixtureStageId: param.fixtureStageId,
        tournamentId: param.tournamentId,
      })
      .pipe(
        map((matches) => {
          return matches.filter((m) => {
            return param.states.includes(m.match.status);
          });
        })
      );
  }
}
