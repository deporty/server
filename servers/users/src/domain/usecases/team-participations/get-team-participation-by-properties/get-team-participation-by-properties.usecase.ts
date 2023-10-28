import { TeamParticipationEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of } from 'rxjs';
import { TeamParticipationContract } from '../../../contracts/team-participation.contract';
import { map } from 'rxjs/operators';

export interface Param {
  teamId: string;
  userId: string;
  initDate: Date;
}

export class GetTeamParticipationByPropertiesUsecase extends Usecase<Param, TeamParticipationEntity | undefined> {
  constructor(private teamParticipationContract: TeamParticipationContract) {
    super();
  }
  call(param: Param): Observable<TeamParticipationEntity | undefined> {
    if (!param.teamId || !param.userId || !param.initDate) return of(undefined);

    return this.teamParticipationContract
      .filter(
        {
          userId: param.userId,
        },
        {
          teamId: {
            operator: '==',
            value: param.teamId,
          },
        }
      )
      .pipe(
        map((teamParticipations) => {
          return teamParticipations.filter((x) => {
            return !x.retirementDate;
          });
        }),
        map((teamParticipations) => {
          console.log('GetTeamParticipationByPropertiesUsecase');
          console.log(teamParticipations);

          if (teamParticipations.length) {
            return teamParticipations[0];
          }
          return undefined;
        })
      );
  }
}
