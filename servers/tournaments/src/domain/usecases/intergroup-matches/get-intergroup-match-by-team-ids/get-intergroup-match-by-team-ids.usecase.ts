import { Id, IntergroupMatchEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';

export interface Param {
  fixtureStageId: Id;
  teamAId: Id;
  teamBId: Id;
  tournamentId: Id;
}

export class GetIntergroupMatchByTeamIdsUsecase extends Usecase<Param, IntergroupMatchEntity | undefined> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }

  call(param: Param): Observable<IntergroupMatchEntity | undefined> {
    return this.intergroupMatchContract
      .get({
        tournamentId: param.tournamentId,
        fixtureStageId: param.fixtureStageId,
      })
      .pipe(
        map((entity: IntergroupMatchEntity[]) => {
          return entity
            .filter((x) => {
              return (
                (x.match.teamAId == param.teamAId && x.match.teamBId == param.teamBId) ||
                (x.match.teamAId == param.teamBId && x.match.teamBId == param.teamAId)
              );
            })
            .pop();
        })
      );
  }
}
