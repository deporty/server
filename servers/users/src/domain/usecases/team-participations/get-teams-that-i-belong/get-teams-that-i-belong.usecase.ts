import { Id, TeamEntity, TeamParticipationEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TeamParticipationContract } from '../../../contracts/team-participation.contract';
import { TeamContract } from '../../../contracts/team.contract';

export interface Response {
  team: TeamEntity;
  teamParticipation: TeamParticipationEntity;
}

export class GetTeamsThatIBelongUsecase extends Usecase<string, Response[]> {
  constructor(private teamParticipationContract: TeamParticipationContract, private teamContract: TeamContract) {
    super();
  }

  call(userId: Id): Observable<Response[]> {
    return this.teamParticipationContract
      .get({
        userId,
      })
      .pipe(
        mergeMap((response: TeamParticipationEntity[]) => {
          if (response.length == 0) {
            return of([]);
          }

          const t = response.filter((item) => !item.retirementDate);

          return t.length
            ? zip(
                ...t.map((teamParticipation) => {
                  return this.teamContract.getTeamById(teamParticipation.teamId).pipe(
                    map((team) => {
                      return {
                        team,
                        teamParticipation,
                      };
                    })
                  );
                })
              )
            : of([]);
        }),
        map((items) => {
          return items.filter((item) => item.team.status != 'deleted');
        })
      );
  }
}
