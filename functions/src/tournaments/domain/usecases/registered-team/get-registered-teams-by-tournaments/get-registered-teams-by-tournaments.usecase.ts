import { Id, RegisteredTeamEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { Usecase } from '../../../../../core/usecase';
import { RegisteredTeamsContract } from '../../../contracts/registered-teams.contract';

export class GetRegisteredTeamsByTournamentIdUsecase extends Usecase<
  string,
  RegisteredTeamEntity[]
> {
  constructor(private registeredTeamsContract: RegisteredTeamsContract) {
    super();
  }

  call(tournamentId: Id): Observable<RegisteredTeamEntity[]> {
    return this.registeredTeamsContract.filter(
      {
        tournamentId,
      },
      {
        tournamentId: {
          operator: '==',
          value: tournamentId,
        },
      }
    );
  }
}
