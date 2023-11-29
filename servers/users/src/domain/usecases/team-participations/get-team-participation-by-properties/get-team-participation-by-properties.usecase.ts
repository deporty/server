import { TeamParticipationEntity } from '@deporty-org/entities';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of } from 'rxjs';
import { TeamParticipationContract } from '../../../contracts/team-participation.contract';
import { map } from 'rxjs/operators';

export interface Param {
  teamId: string;
  userId: string;
  initDate?: Date;
  enrollmentDate?: Date;
}

export class GetTeamParticipationByPropertiesUsecase extends Usecase<Param, TeamParticipationEntity | undefined> {
  constructor(private teamParticipationContract: TeamParticipationContract) {
    super();
  }
  call(param: Param): Observable<TeamParticipationEntity | undefined> {
    const t = !param.initDate && !param.enrollmentDate;
    if (!param.teamId || !param.userId || !t) return of(undefined);

    const fileters: Filters = {
      teamId: {
        operator: '==',
        value: param.teamId,
      },
    };
    
    return this.teamParticipationContract
      .filter(
        {
          userId: param.userId,
        },
        fileters
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
