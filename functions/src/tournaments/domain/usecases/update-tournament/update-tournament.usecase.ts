import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { TournamentContract } from '../../contracts/tournament.contract';
import { GetTournamentsByUniqueAttributesUsecase } from '../exists-tournament/exists-tournament.usecase';

export class TournamentAlreadyExistsError extends Error {
  constructor() {
    super();
    this.name = 'TournamentAlreadyExistsError';
    this.message = `The tournament with these properties already exists. Review the data and try again`;
  }
}

export class UpdateTournamentUsecase extends Usecase<
  TournamentEntity,
  TournamentEntity
> {
  constructor(
    private tournamentContract: TournamentContract,
    private getTournamentsByUniqueAttributesUsecase: GetTournamentsByUniqueAttributesUsecase
  ) {
    super();
  }

  call(tournament: TournamentEntity): Observable<TournamentEntity> {
    return this.getTournamentsByUniqueAttributesUsecase.call(tournament).pipe(
      mergeMap((tournaments: TournamentEntity[]) => {
        const othersTournaments = tournaments.filter(
          (x) => x.id !== tournament.id
        );
        if (othersTournaments.length > 0) {
          return throwError(new TournamentAlreadyExistsError());
        }
        return this.tournamentContract.update(tournament.id!, tournament);
      })
    );
  }
}
