import { Id } from '@deporty-org/entities';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { MatchContract } from '../../../contracts/match.contract';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
  teamAId: Id;
  teamBId: Id;
}

export class AddMatchToGroupInsideTournamentUsecase extends Usecase<
  Param,
  MatchEntity
> {
  constructor(private matchContract: MatchContract) {
    super();
  }
  //TODO: Verificar que no exista otro partido igual en el mismo grupo
  call(param: Param): Observable<MatchEntity> {
    const match: MatchEntity = {
      teamAId: param.teamAId,
      teamBId: param.teamBId,
      status: 'editing',
    };

    return this.matchContract
      .save(
        {
          tournamentId: param.tournamentId,
          fixtureStageId: param.fixtureStageId,
          groupId: param.groupId,
        },
        match
      )
      .pipe(
        map((id) => {
          return { ...match, id };
        })
      );
  }
}
