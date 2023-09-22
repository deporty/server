import { TeamParticipationEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { TeamParticipationContract } from '../../../contracts/team-participation.contract';
import { map } from 'rxjs/operators';

export interface Param {
  userId: string;
  teamParticipation: TeamParticipationEntity;
}

export class AddTeamParticipationUsecase extends Usecase<Param, TeamParticipationEntity> {
  constructor(private teamParticipationContract: TeamParticipationContract) {
    super();
  }

  call(param: Param): Observable<TeamParticipationEntity> {
    return this.teamParticipationContract
      .save(
        {
          userId: param.userId,
        },
        param.teamParticipation
      )
      .pipe(
        map((id) => {
          return {
            ...param.teamParticipation,
            id,
          };
        })
      );
  }
}
