import { TournamentInscriptionEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { TournamentInscriptionContract } from '../../contracts/tournament-inscription.contract';

export class GetTournamentInscriptionsByTeamIdUsecase extends Usecase<string, TournamentInscriptionEntity[]> {
  constructor(private tournamentInscriptionContract: TournamentInscriptionContract) {
    super();
  }
  call(teamId: string): Observable<TournamentInscriptionEntity[]> {
    return this.tournamentInscriptionContract.get({ teamId });
  }
}
