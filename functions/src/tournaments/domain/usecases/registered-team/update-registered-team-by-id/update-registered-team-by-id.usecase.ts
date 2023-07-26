import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';
import {
  GetRegisteredTeamByIdUsecase,
} from '../get-registered-team-by-id/get-registered-team-by-id.usecase';

export interface Params {
  registeredTeam: RegisteredTeamEntity;
  tournamentId: Id;
}

export class UpdateRegisteredTeamByIdUsecase extends Usecase<
  Params,
  RegisteredTeamEntity
> {
  constructor(
    private getRegisteredTeamByIdUsecase: GetRegisteredTeamByIdUsecase,
    private registeredTeamsContract: RegisteredTeamsContract
  ) {
    super();
  }

  call(params: Params): Observable<RegisteredTeamEntity> {
    return this.getRegisteredTeamByIdUsecase
      .call({
        tournamentId: params.tournamentId,
        registeredTeamId: params.registeredTeam.id!,
      })
      .pipe(
        mergeMap((data) => {
          return this.registeredTeamsContract
            .update(
              {
                tournamentId: params.tournamentId,
              },
              params.registeredTeam
            )
            .pipe(map(() => params.registeredTeam));
        })
      );
  }
}
