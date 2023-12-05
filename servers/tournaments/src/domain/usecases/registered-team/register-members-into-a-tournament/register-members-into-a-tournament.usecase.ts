import { Usecase } from '@scifamek-open-source/iraca/domain';
import {
  Param,
  RegisterSingleMemberIntoATournamentUsecase,
} from '../register-single-member-into-a-tournament/register-single-member-into-a-tournament.usecase';
import { Observable, of, zip } from 'rxjs';
import { TournamentInscriptionEntity } from '@deporty-org/entities';

export class RegisterMembersIntoATournamentUsecase extends Usecase<Param[], TournamentInscriptionEntity[]> {
  constructor(private registerSingleMemberIntoATournamentUsecase: RegisterSingleMemberIntoATournamentUsecase) {
    super();
  }
  call(param: Param[]): Observable<TournamentInscriptionEntity[]> {
    return param.length > 0 ? zip(...param.map((x) => this.registerSingleMemberIntoATournamentUsecase.call(x))) : of([]);
  }
}
