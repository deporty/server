import { IPlayerModel } from '@deporty-org/entities/players';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../core/usecase';
import { PlayerContract } from '../../player.contract';
import { PlayerDoesNotExistError } from './get-player-by-id.exceptions';

export class GetPlayerByIdUsecase extends Usecase<string, IPlayerModel> {
  constructor(private playerContract: PlayerContract) {
    super();
  }
  call(id: string): Observable<IPlayerModel> {
    return this.playerContract.getById(id).pipe(
      mergeMap((player: IPlayerModel | undefined) => {
        if (player) {
          return of(player);
        }
        return throwError(new PlayerDoesNotExistError(id));
      })
    );
  }
}
