import { IPlayerModel } from '@deporty-org/entities/players';
import { Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FileAdapter } from '../../../core/file/file.adapter';
import { Usecase } from '../../../core/usecase';
import { PlayerContract } from '../../player.contract';
import { GetPlayerByDocumentUsecase } from '../get-player-by-document/get-player-by-document.usecase';
import { GetPlayerByEmailUsecase } from '../get-player-by-email/get-player-by-email.usecase';
import { PlayerAlreadyExistsException } from './create-player.exceptions';

export class CreatePlayerUsecase extends Usecase<IPlayerModel, string> {
  constructor(
    public playerContract: PlayerContract,
    private fileAdapter: FileAdapter,
    private getPlayerByDocumentUsecase: GetPlayerByDocumentUsecase,
    private getPlayerByEmailUsecase: GetPlayerByEmailUsecase
  ) {
    super();
  }
  call(player: IPlayerModel): Observable<string> {
    return this.getPlayerByDocumentUsecase.call(player.document).pipe(
      map((playerPrev: IPlayerModel | undefined) => {
        if (playerPrev) {
          return throwError(
            new PlayerAlreadyExistsException(playerPrev.document)
          );
        } else {
          if (player.email != undefined && player.email != '') {
            return this.getPlayerByEmailUsecase.call(player.email).pipe(
              map((playerEmailPrev: IPlayerModel | undefined) => {
                if (playerEmailPrev) {
                  return throwError(
                    new PlayerAlreadyExistsException(player.email)
                  );
                } else {
                  if (player.image) {
                    const extension = player.image
                      .split(',')[0]
                      .split('/')[1]
                      .split(';')[0];
                    const path = `players/${player.document}/profile.${extension}`;
                    return this.fileAdapter.uploadFile(path, player.image).pipe(
                      map(() => {
                        const updatedPlayer = { ...player };
                        updatedPlayer.image = path;
                        return this.playerContract.save(updatedPlayer);
                      }),
                      mergeMap((x) => x)
                    );
                  }
                  return this.playerContract.save(player);
                }
              }),
              mergeMap((x) => x)
            );
          }

          return this.playerContract.save(player);
        }
      }),
      mergeMap((x) => x)
    );
  }
}
