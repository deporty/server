import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
import { Id } from '@deporty-org/entities';
import { TournamentLayoutContract } from '../../contracts/tournament-layout.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetTournamentLayoutsByOrganizationIdUsecase extends Usecase<
  Id,
  Array<TournamentLayoutEntity>
> {
  constructor(private tournamentLayoutContract: TournamentLayoutContract) {
    super();
  }

  call(organizationId: Id): Observable<TournamentLayoutEntity[]> {
    return this.tournamentLayoutContract.filter({ organizationId }, {
      organizationId: {
        operator: "==",
        value: organizationId
      }
    });
  }
}
