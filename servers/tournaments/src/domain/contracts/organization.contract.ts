import { Id } from '@deporty-org/entities';
import { OrganizationEntity, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Observable } from 'rxjs';
export abstract class OrganizationContract {

  abstract getOrganizationById(
    organizationId: Id
  ): Observable<OrganizationEntity>;

  abstract getTournamentLayoutByIdUsecase(
    organizationId: Id,
    tournamentLayoutId: Id
  ): Observable<TournamentLayoutEntity>;
}
