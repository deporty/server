import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { TournamentContract } from '../../contracts/tournament.contract';
import { Filters, Pagination, Usecase } from '@scifamek-open-source/iraca/domain';

export class GetTournamentsForCheckInUsecase extends Usecase<Pagination, TournamentEntity[]> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }
  call(): Observable<TournamentEntity[]> {
    const filters: Filters = {
      status: {
        operator: 'in',
        value: ['check-in'],
      },
    };
    return this.tournamentContract.filter(filters);
  }
}
