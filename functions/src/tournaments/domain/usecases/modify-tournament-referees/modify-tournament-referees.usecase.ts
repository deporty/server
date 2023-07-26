import {
  Id,
  TournamentEntity
} from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';

export class NotAllowedStatusModificationError extends Error {
  constructor() {
    super();
    this.name = 'NotAllowedStatusModificationError';
    this.message = `The tournament status can be modified.`;
  }
}

export interface Params {
  tournamentId: Id;
  refereeIds: Id[];
}
export class ModifyTournamentRefereesUsecase extends Usecase<
  Params,
  TournamentEntity
> {
  constructor(
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private updateTournamentUsecase: UpdateTournamentUsecase
  ) {
    super();
  }

  call(param: Params): Observable<TournamentEntity> {
    return this.getTournamentByIdUsecase.call(param.tournamentId).pipe(
      mergeMap((tournament: TournamentEntity) => {
        tournament.refereeIds = param.refereeIds;
        return this.updateTournamentUsecase.call(tournament);
      })

    );
  }
}
