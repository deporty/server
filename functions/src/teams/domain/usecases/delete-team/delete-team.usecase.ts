import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
import { VariableNotDefinedException } from '../../../../core/exceptions';
import { FileAdapter } from '../../../../core/file/file.adapter';
import { Usecase } from '../../../../core/usecase';
import { TeamContract } from '../../contracts/team.contract';

export class DeleteTeamUsecase extends Usecase<string, void> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByIdUsecase: GetTeamByIdUsecase,
    private fileAdapter: FileAdapter
  ) {
    super();
  }

  call(id: string): Observable<void> {
    if (!id) {
      return throwError(new VariableNotDefinedException('id'));
    }
    return this.getTeamByIdUsecase.call(id).pipe(
      map((player) => {
        if (player.shield) {
          return this.fileAdapter.deleteFile(player.shield).pipe(
            map((item) => {
              return this.teamContract.delete(id);
            }),
            mergeMap((x) => x)
          );
        }
        return this.teamContract.delete(id);
      }),
      catchError((error) => {
        return throwError(error);
      }),
      mergeMap((x) => x)
    );
  }
}
