import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Pagination, Usecase } from '../../../../core/usecase';
import { TournamentContract } from '../../contracts/tournament.contract';

export class GetTournamentsUsecase extends Usecase<
  Pagination,
  TournamentEntity[]
> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }
  call(params: Pagination): Observable<TournamentEntity[]> {
    return this.tournamentContract.get({
      pageNumber: parseInt(params.pageNumber + ''),
      pageSize: parseInt(params.pageSize + ''),
    });
  }
}
