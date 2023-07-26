import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Usecase } from '../../../../core/usecase';
import { NodeMatchContract } from '../../contracts/node-match.contract';

export class GetMainDrawNodeMatchesoverviewUsecase extends Usecase<
  string,
  Array<NodeMatchEntity>
> {
  constructor(private nodeMatchContract: NodeMatchContract) {
    super();
  }

  call(tournamentId: string): Observable<NodeMatchEntity[]> {
    
    return this.nodeMatchContract.filter(
      {
        tournamentId,
      },
      {
        tournamentId: {
          operator: '==',
          value: tournamentId,
        },
      }
    );
  }
}
