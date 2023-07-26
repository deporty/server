import { Id } from '@deporty-org/entities';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable, of, throwError } from 'rxjs';
import {  mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { TournamentContract } from '../../contracts/tournament.contract';
import { TournamentDoesNotExistError } from '../../tournaments.exceptions';



export class GetTournamentByIdUsecase extends Usecase<Id, TournamentEntity> {
  constructor(private tournamentContract: TournamentContract) {
    super();
  }
  call(tournamentId: Id): Observable<TournamentEntity> {
    return this.tournamentContract.getById(tournamentId).pipe(
      mergeMap((tournament: TournamentEntity | undefined) => {
        if (!tournament) {
          return throwError(new TournamentDoesNotExistError(tournamentId));
        }
        return of(tournament);
      })
    );
  }
}
