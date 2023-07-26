import { IPlayerModel } from '@deporty-org/entities/players';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../core/usecase';
import { PlayerContract } from '../../player.contract';

export class GetPlayerByDocumentUsecase extends Usecase<
  string,
  IPlayerModel | undefined
> {
  constructor(private playerContract: PlayerContract) {
    super();
  }
  call(document: string): Observable<IPlayerModel | undefined> {
    return document
      ? this.playerContract
          .filter({
            document: {
              operator: '==',
              value: document,
            },
          })
          .pipe(
            map((players: IPlayerModel[]) => {
              return players.length > 0 ? players[0] : undefined;
            })
          )
      : of(undefined);
  }
}
