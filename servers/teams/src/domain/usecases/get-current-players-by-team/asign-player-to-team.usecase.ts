import { IPlayerModel } from '@deporty-org/entities/players';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { TeamContract } from '../../contracts/team.contract';

export interface IAsignPlayerToTeam {
  player: IPlayerModel;
  teamName: string;
}

export class GetCurrentPlayersByTeamUsecase extends Usecase<
  string,
  IPlayerModel[]
> {
  constructor(
    public teamContract: TeamContract,
    private getTeamByIdUsecase: GetTeamByIdUsecase
  ) {
    super();
  }

  call(teamId: string): any {
    const $team = this.getTeamByIdUsecase.call(teamId);

    $team.pipe(
      catchError((error) => {
        return throwError(error);
      }),
      map((team) => {})
    );
  }
}
