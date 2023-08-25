import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Pagination, Usecase } from '../../../../core/usecase';
import { TournamentContract } from '../../contracts/tournament.contract';
import { Filters } from '../../../../core/helpers';

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
