import { Id } from '@deporty-org/entities';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Usecase } from '../../../../core/usecase';
import { TournamentContract } from '../../contracts/tournament.contract';
import { Filters } from '../../../../core/helpers';

export interface Params {
  organizationId: Id;
  tournamentLayoutId: Id;
  includeDraft: boolean;
}
export class GetTournamentsByOrganizationAndTournamentLayoutUsecase extends Usecase<
  Params,
  TournamentEntity[]
> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }
  call(params: Params): Observable<TournamentEntity[]> {
    const filters: Filters = {
      organizationId: {
        operator: '==',
        value: params.organizationId,
      },
      tournamentLayoutId: {
        operator: '==',
        value: params.tournamentLayoutId,
      },
    };

    if (!params.includeDraft) {
      filters['status'] = {
        operator: 'not-in',
        value: ['draft', 'deleted'],
      };
    }

    return this.tournamentContract.filter(filters);
  }
}
