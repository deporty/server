import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { Observable, of, throwError } from 'rxjs';
import { Usecase } from '../../../../../core/usecase';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';
import { mergeMap } from 'rxjs/operators';

export interface Params {
  tournamentId: Id;
  registeredTeamId: Id;
}

export class RegisteredTeamDoesNotExist extends Error {
  constructor() {
    super();
    this.name = 'RegisteredTeamDoesNotExist';
    this.message = `The registered team does not exist`;
  }
}

export class GetRegisteredTeamByIdUsecase extends Usecase<
  Params,
  RegisteredTeamEntity
> {
  constructor(private registeredTeamsContract: RegisteredTeamsContract) {
    super();
  }

  call(params: Params): Observable<RegisteredTeamEntity> {
    return this.registeredTeamsContract
      .getById(
        {
          tournamentId: params.tournamentId,
        },
        params.registeredTeamId
      )
      .pipe(
        mergeMap((data) => {
          if (!data) {
            return throwError(new RegisteredTeamDoesNotExist());
          }
          return of(data);
        })
      );
  }
}
