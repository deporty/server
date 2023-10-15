import { TournamentInscriptionEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { TournamentInscriptionContract } from '../../contracts/tournament-inscription.contract';
import { map } from 'rxjs/operators';

export class SaveTournamentInscriptionsByTeamUsecase extends Usecase<TournamentInscriptionEntity, TournamentInscriptionEntity> {
  constructor(private tournamentInscriptionContract: TournamentInscriptionContract) {
    super();
  }
  call(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity> {
    return this.tournamentInscriptionContract.save({ teamId: inscription.teamId }, inscription).pipe(map((id) => ({ ...inscription, id })));
  }
}
