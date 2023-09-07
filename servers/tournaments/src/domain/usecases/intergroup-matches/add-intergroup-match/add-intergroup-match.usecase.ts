import { IntergroupMatchEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Id } from '@deporty-org/entities';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';
import { map } from 'rxjs/operators';

export interface Param {
  tournamentId: string;
  fixtureStageId: string;
  teamAId: Id;
  teamBId: Id;
}

export class AddIntergroupMatchUsecase extends Usecase<
  Param,
  IntergroupMatchEntity
> {
  constructor(private intergroupMatchContract: IntergroupMatchContract) {
    super();
  }

  call(param: Param): Observable<IntergroupMatchEntity> {
    const r: IntergroupMatchEntity = {
      fixtureStageId: param.fixtureStageId,
      match: {
        status: 'editing',
        teamAId: param.teamAId,
        teamBId: param.teamBId,
      },
    };
    return this.intergroupMatchContract
      .save(
        {
          tournamentId: param.tournamentId,
          fixtureStageId: param.fixtureStageId,
        },
        { ...r }
      )
      .pipe(
        map((id: Id) => {
          return { ...r, id };
        })
      );
  }
}
