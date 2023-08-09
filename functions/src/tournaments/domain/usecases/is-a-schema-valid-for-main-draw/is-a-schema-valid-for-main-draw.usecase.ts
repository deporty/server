import { TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { Usecase } from '../../../../core/usecase';
import { Observable, of } from 'rxjs';

export class IsASchemaValidForMainDrawUsecase extends Usecase<TournamentLayoutSchema, boolean> {
  call(schema: TournamentLayoutSchema): Observable<boolean> {
    const lastFixtureStageConfiguration = [...schema.stages].pop();
    if (!lastFixtureStageConfiguration) {
      return of(false);
    }

    const fullPassedTeams = lastFixtureStageConfiguration.passedTeamsCount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    const isEven = fullPassedTeams % 2 == 0;
    if (!isEven) {
      return of(false);
    }

    const maxLevelTree = Math.floor(Math.log(fullPassedTeams) / Math.log(2));

    let sum = 0;

    let i = maxLevelTree;
    while (i > 0 && sum < fullPassedTeams) {
      sum += Math.pow(2, i);

      i--;
    }
    return of(sum == fullPassedTeams);
  }
}
