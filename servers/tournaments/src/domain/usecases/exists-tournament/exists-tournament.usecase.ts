import { TournamentEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { TournamentContract } from '../../contracts/tournament.contract';

export class GetTournamentsByUniqueAttributesUsecase extends Usecase<
  TournamentEntity,
  TournamentEntity[]
> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }

  call(tournament: TournamentEntity): Observable<TournamentEntity[]> {
    const filters: Filters = {
      category: {
        operator: '==',
        value: tournament.category,
      },
      edition: {
        operator: '==',
        value: tournament.edition || '',
      },
      organizationId: {
        operator: '==',
        value: tournament.organizationId,
      },
      tournamentLayoutId: {
        operator: '==',
        value: tournament.tournamentLayoutId,
      },
      version: {
        operator: '==',
        value: tournament.version,
      },
    };

    return this.tournamentContract.filter(filters);
  }
}
