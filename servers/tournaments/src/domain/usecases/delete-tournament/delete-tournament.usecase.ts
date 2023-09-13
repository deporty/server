import { Id, TournamentEntity } from '@deporty-org/entities';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { TournamentContract } from '../../contracts/tournament.contract';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';

export class DeleteTournamentUsecase extends Usecase<
  Id,
  TournamentEntity | null
> {
  constructor(
    private tournamentContract: TournamentContract,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private updateTournamentUsecase: UpdateTournamentUsecase,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(id: Id): Observable<TournamentEntity | null> {
    return this.getTournamentByIdUsecase.call(id).pipe(
      mergeMap((tournament: TournamentEntity) => {
        if (tournament.status == 'draft') {
          return this.tournamentContract.delete(id).pipe(
            mergeMap(() => {
              if (tournament.flayer) {
                return this.fileAdapter
                  .deleteFile(tournament.flayer)
                  .pipe(map(() => null));
              }
              return of(null);
            })
          );
        } else {
          tournament.status = 'deleted';
          return this.updateTournamentUsecase.call(tournament);
        }
      })
    );
  }
}
