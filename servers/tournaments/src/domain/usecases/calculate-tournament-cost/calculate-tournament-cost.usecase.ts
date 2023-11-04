import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganizationContract } from '../../contracts/organization.contract';
import { GetAllMatchesInsideTournamentUsecase } from '../get-all-matches-inside-tournament/get-all-matches-inside-tournament.usecase';

export class CalculateTournamentCostUsecase extends Usecase<TournamentEntity, any> {
  constructor(
    private organizationContract: OrganizationContract,

    private getAllMatchesInsideTournamentUsecase: GetAllMatchesInsideTournamentUsecase
  ) {
    super();
  }

  call(tournament: TournamentEntity): Observable<any> {
    const $organization = this.organizationContract.getOrganizationById(tournament.organizationId);
    const $matches = this.getAllMatchesInsideTournamentUsecase.call({
      tournamentId: tournament.id!,
      status: ['completed', 'in-review', 'published', 'running'],
    });
    return zip($organization, of(tournament), $matches).pipe(
      map(([organization, tournament, matches]) => {
        const tournamentTemp = { ...tournament };
        const NP = matches.length;
        const NTP = organization.NTP;
        const FMTA = organization.FMTA;

        const NPc = 2500;
        const NTPc = 0.035;
        const FMTAc = 0.0845;

        const cost = NP * NPc - (NTP != 0 ? NTPc * Math.log(NTP) * 10 : 0) - FMTA * FMTAc;
        tournamentTemp.financialStatements.amount = cost;
        return {
          tournament: tournamentTemp,
          results: {
            matches: {
              NP,
              NTP,
              FMTA,
              cost,
            },
          },
        };
      })
    );
  }
}
