import { Id } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';

export interface Param {
  teamId: Id;
  memberId: Id;
  tournamentId: Id;
}

export class RegisterMemberIntoTournamentUsecase extends Usecase<Param, Response> {
  constructor() {
    super();
  }
  call(param: Param): Observable<Response> {
    throw new Error('Method not implemented.');
  }
}
