import { Id } from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { TournamentLayoutContract } from '../../contracts/tournament-layout.contract';

export class TournamentLayoutNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'TournamentLayoutNotFoundError';
    this.message = `The tournament layout was not found.`;
  }
}

export interface Params {
  organizationId: Id;
  tournamentLayoutId: Id;
}
export class GetTournamentLayoutByIdUsecase extends Usecase<
  Params,
  TournamentLayoutEntity
> {
  constructor(private tournamentLayoutContract: TournamentLayoutContract) {
    super();
  }
  call(params: Params): Observable<TournamentLayoutEntity> {
    return this.tournamentLayoutContract
      .getById(
        {
          organizationId: params.organizationId,
        },
        params.tournamentLayoutId
      )
      .pipe(
        mergeMap((tournamentLayout: TournamentLayoutEntity | undefined) => {
          if (!tournamentLayout) {
            return throwError(new TournamentLayoutNotFoundError());
          }
          return of(tournamentLayout);
        })
      );
  }
}
