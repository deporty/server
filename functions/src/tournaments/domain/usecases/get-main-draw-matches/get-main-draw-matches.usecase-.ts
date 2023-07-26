// import { MatchEntity } from '@deporty-org/entities/tournaments';
// import { Observable } from 'rxjs';
// import { Usecase } from '../../../../core/usecase';
// import { TournamentContract } from '../../tournament.contract';

// export class GetMainDrawMatchesUsecase extends Usecase<
//   string,
//   Array<MatchEntity>
// > {
//   constructor(private tournamentContract: TournamentContract) {
//     super();
//   }

//   call(tournamentId: string): Observable<MatchEntity[]> {
//     return this.tournamentContract.getMainDrawMatches(tournamentId);
//   }
// }
