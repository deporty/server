// import {
//   IntergroupMatchEntity
// } from '@deporty-org/entities/tournaments';
// import { Observable, of, throwError } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '@scifamek-open-source/iraca/domain';
// import { TournamentContract } from '../../tournament.contract';
// import { MatchDoesNotExist } from '../../tournaments.exceptions';
// import { NodeMatchContract } from '../../../infrastructure/contracts/node-match.contract';

// export interface Param {
//   tournamentId: string;
//   stageId: string;
//   intergroupMatchId: string;
// }

// export class GetIntergroupMatchUsecase extends Usecase<Param, IntergroupMatchEntity> {
//   constructor(
//     private nodeMatchContract: NodeMatchContract,
//   ) {
//     super();
//   }
//   call(param: Param): Observable<IntergroupMatchEntity> {
//     return this.nodeMatchContract
//       .getById(
//         {
//           tournamentId: param.tournamentId,

//         }
//         param.tournamentId,
//         param.stageId,
//         param.intergroupMatchId
//       )
//       .pipe(
//         map((tournament: IntergroupMatchEntity | undefined) => {
//           if (!tournament) {
//             return throwError(new MatchDoesNotExist());
//           }
//           return of(tournament);
//         }),
//         mergeMap((x) => x)
//       );
//   }
// }
