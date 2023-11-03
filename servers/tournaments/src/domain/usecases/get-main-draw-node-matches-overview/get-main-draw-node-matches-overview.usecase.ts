import { MatchStatusType, NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { NodeMatchContract } from '../../contracts/node-match.contract';
import { Id } from '@deporty-org/entities';
import { map } from 'rxjs/operators';

export interface Param {
  tournamentId: Id;
  status: MatchStatusType[];
}

export class GetMainDrawNodeMatchesoverviewUsecase extends Usecase<Param, Array<NodeMatchEntity>> {
  constructor(private nodeMatchContract: NodeMatchContract) {
    super();
  }

  call(param: Param): Observable<NodeMatchEntity[]> {

    const status = param.status || ['completed', 'editing', 'in-review', 'published', 'running'];

    return this.nodeMatchContract
      .get({
        tournamentId: param.tournamentId,
      })
      .pipe(
        map((matches) => {
          return matches.filter((matches) => status.includes(matches.match.status));
        })
      );
  }
}
