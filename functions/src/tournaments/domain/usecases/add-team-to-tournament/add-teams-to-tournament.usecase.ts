import { RegisteredTeamEntity } from '@deporty-org/entities';
import { Observable, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { RegisteredTeamsContract } from '../../contracts/registered-teams.contract';
import { TeamContract } from '../../contracts/team.contract';

export class TeamsArrayEmptyError extends Error {
  constructor() {
    super(`The team ids array is empty`);
    this.name = 'TeamsArrayEmptyError';
  }
}

export interface Param {
  teamIds: string[];
  tournamentId: string;
}

export class AddTeamsToTournamentUsecase extends Usecase<
  Param,
  RegisteredTeamEntity[]
> {
  constructor(
    private registeredTeamsContract: RegisteredTeamsContract,
    private teamContract: TeamContract,
  ) {
    super();
  }

  call(param: Param): Observable<RegisteredTeamEntity[]> {
    if (param.teamIds.length == 0) {
      return throwError(new TeamsArrayEmptyError());
    }

    const teams = [];
    for (const teamId of param.teamIds) {
      const members = this.teamContract.getMembersByTeam(teamId).pipe(
        map((members) => {
          const registeredTeam: RegisteredTeamEntity = {
            enrollmentDate: new Date(),
            members: members.map((x) => x.member),
            teamId,
            tournamentId: param.tournamentId,
            status: 'pre-registered'
          };
          return registeredTeam;
        }),
        mergeMap((registeredTeam: RegisteredTeamEntity) => {
          return this.registeredTeamsContract
            .save({ tournamentId: param.tournamentId }, registeredTeam)
            .pipe(
              map((id: string) => {
                return { ...registeredTeam, id };
              })
            );
        })
      );
      teams.push(members);
    }

    return zip(...teams);
  }
}
