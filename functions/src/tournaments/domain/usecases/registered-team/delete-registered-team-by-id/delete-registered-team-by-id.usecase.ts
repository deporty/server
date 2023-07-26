import { Id } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';

export interface Params {
  tournamentId: Id;
  registeredTeamId: Id;
}

export class DeleteRegisteredTeamByIdUsecase extends Usecase<Params, Id> {
  constructor(private registeredTeamsContract: RegisteredTeamsContract) {
    super();
  }

  call(params: Params): Observable<Id> {
    return this.registeredTeamsContract
      .delete(
        {
          tournamentId: params.tournamentId,
        },
        params.registeredTeamId
      )
      .pipe(
        map(() => {
          return params.registeredTeamId;
        })
      );
  }
}
