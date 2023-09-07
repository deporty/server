import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Filters, Pagination, Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { TournamentContract } from '../../contracts/tournament.contract';

export class GetCurrentTournamentsUsecase extends Usecase<Pagination, TournamentEntity[]> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }
  call(): Observable<TournamentEntity[]> {
    const filters: Filters = {
      status: {
        operator: 'in',
        value: ['running', 'check-in'],
      },
    };
    return this.tournamentContract.filter(filters);
  }
}
