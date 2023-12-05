import { TournamentInscriptionEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, throwError } from 'rxjs';
import { TournamentInscriptionContract } from '../../contracts/tournament-inscription.contract';
import { map, mergeMap } from 'rxjs/operators';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const TournamentInscriptionDoesNotExist = generateError('TournamentInscriptionDoesNotExist', `Consider usign a square image`);

export class UpdateTournamentInscriptionsByTeamUsecase extends Usecase<TournamentInscriptionEntity, TournamentInscriptionEntity> {
  constructor(private tournamentInscriptionContract: TournamentInscriptionContract) {
    super();
  }
  call(inscription: TournamentInscriptionEntity): Observable<TournamentInscriptionEntity> {
    return this.tournamentInscriptionContract
      .filter(
        {
          teamId: inscription.teamId,
        },

        {
          tournamentId: {
            operator: '==',
            value: inscription.tournamentId,
          },
        }
      )
      .pipe(
        mergeMap((inscriptionPrev) => {

          if (inscriptionPrev.length > 0) {
            const toUpdate: TournamentInscriptionEntity = {
              ...inscription,
              id: inscriptionPrev[0].id,
            };
            return this.tournamentInscriptionContract
              .update({ teamId: inscription.teamId }, toUpdate)
              .pipe(map((id) => ({ ...toUpdate })));
          }

          return throwError(new TournamentInscriptionDoesNotExist());
        })
      );
  }
}
