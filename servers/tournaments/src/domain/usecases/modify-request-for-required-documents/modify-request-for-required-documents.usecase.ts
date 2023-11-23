import { Id } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TournamentContract } from '../../contracts/tournament.contract';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
export interface Param {
  status: boolean;
  tournamentId: Id;
}

export class ModifyRequestForRequiredDocumentsUsecase extends Usecase<Param, boolean> {
  constructor(private getTournamentByIdUsecase: GetTournamentByIdUsecase, private tournamentContract: TournamentContract) {
    super();
  }

  call(param: Param): Observable<boolean> {
    return this.getTournamentByIdUsecase.call(param.tournamentId).pipe(
      mergeMap((prevTournament) => {
        return this.tournamentContract.update(prevTournament.id!, { ...prevTournament, requestRequiredDocs: param.status });
      }),
      map((x) => param.status)
    );
  }
}
