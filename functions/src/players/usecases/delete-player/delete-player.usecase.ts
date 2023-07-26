import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { VariableNotDefinedException } from '../../../core/exceptions';
import { FileAdapter } from '../../../core/file/file.adapter';
import { Usecase } from '../../../core/usecase';
import { PlayerContract } from '../../player.contract';
import { GetPlayerByIdUsecase } from '../get-player-by-id/get-player-by-id.usecase';

export class DeletePlayerUsecase extends Usecase<string, void> {
  constructor(
    public playerContract: PlayerContract,
    private fileAdapter: FileAdapter,
    private getPlayerByIdUsecase: GetPlayerByIdUsecase
  ) {
    super();
  }
  call(id: string): Observable<void> {
    if (!id) {
      return throwError(new VariableNotDefinedException('id'));
    }
    return this.getPlayerByIdUsecase.call(id).pipe(
      map((player) => {
        if (player.image) {
          return this.fileAdapter.deleteFile(player.image).pipe(
            map((item) => {
              return this.playerContract.delete(id);
            }),
            mergeMap((x) => x)
          );
        }
        return this.playerContract.delete(id);
      }),
      catchError((error) => {
        return throwError(error);
      }),
      mergeMap((x) => x)
    );
  }
}
