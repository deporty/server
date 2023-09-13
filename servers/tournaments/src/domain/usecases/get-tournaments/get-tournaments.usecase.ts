import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { TournamentContract } from '../../contracts/tournament.contract';
import { Pagination, Usecase } from '@scifamek-open-source/iraca/domain';

export class GetTournamentsUsecase extends Usecase<Pagination, TournamentEntity[]> {
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
