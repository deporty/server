import { Id } from '@deporty-org/entities';
import {
  REGISTERED_TEAM_STATUS,
  RegisteredTeamEntity,
  RegisteredTeamStatus,
} from '@deporty-org/entities/tournaments';
import { Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GetRegisteredTeamByIdUsecase } from '../get-registered-team-by-id/get-registered-team-by-id.usecase';
import { UpdateRegisteredTeamByIdUsecase } from '../update-registered-team-by-id/update-registered-team-by-id.usecase';

export class NotAllowedStatusModificationError extends Error {
  constructor() {
    super();
    this.name = 'NotAllowedStatusModificationError';
    this.message = `The registered team status can be modified.`;
  }
}

export interface Params {
  registeredTeamId: Id;
  status: RegisteredTeamStatus;
  tournamentId: Id;
}
export class ModifyRegisteredTeamStatusUsecase extends Usecase<
  Params,
  RegisteredTeamEntity
> {
  constructor(
    private getRegisteredTeamsByIdIdUsecase: GetRegisteredTeamByIdUsecase,
    private updateRegisteredTeamByIdUsecase: UpdateRegisteredTeamByIdUsecase
  ) {
    super();
  }

  call(param: Params): Observable<RegisteredTeamEntity> {
    
    return this.getRegisteredTeamsByIdIdUsecase
      .call({
        tournamentId: param.tournamentId,
        registeredTeamId: param.registeredTeamId,
      })
      .pipe(
        mergeMap((registeredTeam: RegisteredTeamEntity) => {
          if (!REGISTERED_TEAM_STATUS.includes(param.status)) {
            return throwError(new NotAllowedStatusModificationError());
          }
          if (registeredTeam.status == 'enabled' && param.status != 'enabled') {
            return throwError(new NotAllowedStatusModificationError());
          }
          registeredTeam.status = param.status;
          
          return this.updateRegisteredTeamByIdUsecase.call({
            tournamentId: param.tournamentId,
            registeredTeam,
          });
        })
      );
  }
}
