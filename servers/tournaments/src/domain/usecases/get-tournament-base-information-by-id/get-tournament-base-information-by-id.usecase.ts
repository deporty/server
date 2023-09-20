import { Id } from '@deporty-org/entities';
import { OrganizationEntity, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OrganizationContract } from '../../contracts/organization.contract';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';

export interface Response {
  tournament: TournamentEntity;
  organization: OrganizationEntity;
  tournamentLayout: TournamentLayoutEntity;
}

export class GetTournamentBaseInformationByIdUsecase extends Usecase<Id, Response> {
  constructor(private getTournamentByIdUsecase: GetTournamentByIdUsecase, private organizationContract: OrganizationContract) {
    super();
  }
  call(tournamentId: Id): Observable<Response> {
    return this.getTournamentByIdUsecase.call(tournamentId).pipe(
      mergeMap((tournament: TournamentEntity) => {
        const $organization = this.organizationContract.getOrganizationById(tournament.organizationId);
        const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(
          tournament.organizationId,
          tournament.tournamentLayoutId
        );
        return zip($organization, $tournamentLayout, of(tournament));
      }),
      map(([organization, tournamentLayout, tournament]) => {
        return {
          organization,
          tournament,
          tournamentLayout,
        };
      })
    );
  }
}
