import { Id, NodeMatchEntity } from '@deporty-org/entities';
import { Usecase } from '../../../../../core/usecase';
import { Observable } from 'rxjs';
import { NodeMatchContract } from '../../../contracts/node-match.contract';
import { map } from 'rxjs/operators';

interface Param {
  tournamentId: Id;
  key: number;
  level: number;
  teamAId: Id;
  teamBId: Id;
}
export class CreateNodeMatchUsecase extends Usecase<Param, NodeMatchEntity> {
  constructor(private nodeMatchContract: NodeMatchContract) {
    super();
  }
  call(param: Param): Observable<NodeMatchEntity> {
    const match: NodeMatchEntity = {
      key: param.key,
      level: param.level,
      match: {
        status: 'editing',
        teamAId: param.teamAId,
        teamBId: param.teamBId,
      },
      tournamentId: param.tournamentId,
    };
    return this.nodeMatchContract
      .save(
        {
          tournamentId: param.tournamentId,
        },
        match
      )
      .pipe(
        map((id: Id) => {
          return {
            ...match,
            id,
          };
        })
      );
  }
}
