import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { TournamentContract } from '../../contracts/tournament.contract';

export type Params = any;
export class GetAvailableTournamentsByFiltersUsecase extends Usecase<Params, TournamentEntity[]> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }
  call(params: Params): Observable<TournamentEntity[]> {
    const filters: Filters = {};
    for (const property in params) {
      if (Object.prototype.hasOwnProperty.call(params, property)) {
        const element = params[property];
        filters[property] = {
          operator: '==',
          value: element,
        };
      }
    }

    filters['status'] = {
      operator: 'not-in',
      value: ['draft', 'deleted'],
    };

    console.log(filters);
    
    return this.tournamentContract.filter(filters);
  }
}
