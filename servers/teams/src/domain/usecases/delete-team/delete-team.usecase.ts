import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Usecase } from '@scifamek-open-source/iraca/domain';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { TeamContract } from '../../contracts/team.contract';
import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';

export class DeleteTeamUsecase extends Usecase<string, void> {
  constructor(public teamContract: TeamContract, private getTeamByIdUsecase: GetTeamByIdUsecase, private fileAdapter: FileAdapter) {
    super();
  }

  call(id: string): Observable<void> {
    return this.getTeamByIdUsecase.call(id).pipe(
      mergeMap((player) => {
        if (player.shield) {
          return this.fileAdapter.deleteFile(player.shield).pipe(
            mergeMap((item) => {
              return this.teamContract.delete(id);
            })
          );
        }
        return this.teamContract.delete(id);
      })
    );
  }
}
