// import { NodeMatch } from '@deporty-org/entities/tournaments';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Usecase } from '@scifamek-open-source/iraca/domain';
// import { TournamentContract } from '../../tournament.contract';

// export interface Param {
//   tournamentId: string;
//   nodeMatchId: string;
// }

// export class GetMatchInMainDrawInsideTournamentUsecase extends Usecase<
//   Param,
//   NodeMatch | undefined
// > {
//   constructor(private tournamentContract: TournamentContract) {
//     super();
//   }

//   call(param: Param): Observable<NodeMatch | undefined> {
//     const $nodeMatch = this.tournamentContract.getNodeMatch(
//       param.tournamentId,
//       param.nodeMatchId
//     );
//     return $nodeMatch.pipe(
//       map((tournament) => {
//         return tournament;
//       })
//     );
//   }
// }
