import { FixtureStageEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { FixtureStageRepository } from '../../../../infrastructure/repositories/fixture-stage.repository';

export class GetFixtureStagesByTournamentUsecase extends Usecase<
  string,
  FixtureStageEntity[]
> {
  constructor(private fixtureStageContract: FixtureStageRepository) {
    super();
  }

  call(tournamentId: string): Observable<FixtureStageEntity[]> {
    return this.fixtureStageContract.get({
      tournamentId,
    });
  }
}
