import { Id } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
export abstract class OrganizationContract {
  abstract getTournamentLayoutByIdUsecase(organizationId: Id, tournamentLayoutId: Id): Observable<TournamentLayoutEntity>;
}
