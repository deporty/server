import { Id } from '@deporty-org/entities';
import { MatchesByRefereeIdEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { MatchesByRefereeIdContract } from '../../contracts/matches-by-referee-id.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetMatchesByRefereeIdUsecase extends Usecase<Id, Array<MatchesByRefereeIdEntity>> {
  constructor(private matchesByRefereeIdContract: MatchesByRefereeIdContract) {
    super();
  }
  call(refereeId: string): Observable<MatchesByRefereeIdEntity[]> {
    return this.matchesByRefereeIdContract.filter({
      refereeId: { operator: '==', value: refereeId },
    });
  }
}
