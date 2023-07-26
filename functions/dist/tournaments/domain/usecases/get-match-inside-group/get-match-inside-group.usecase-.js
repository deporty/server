"use strict";
// import { MatchEntity } from '@deporty-org/entities/tournaments';
// import { Observable, of, throwError } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { TournamentContract } from '../../tournament.contract';
// import { MatchDoesNotExist } from '../../tournaments.exceptions';
// export interface Param {
//   tournamentId: string;
//   stageId: string;
//   groupLabel: string;
//   teamAId: string;
//   teamBId: string;
// }
// export class GetMatchInsideGroup extends Usecase<Param, MatchEntity> {
//   constructor(private tournamentContract: TournamentContract) {
//     super();
//   }
//   call(param: Param): Observable<MatchEntity> {
//     return this.tournamentContract
//       .getGroupMatchByTeams(
//         param.tournamentId,
//         param.stageId,
//         param.groupLabel,
//         param.teamAId,
//         param.teamBId
//       )
//       .pipe(
//         map((tournament: MatchEntity | undefined) => {
//           if (!tournament) {
//             return throwError(new MatchDoesNotExist());
//           }
//           return of(tournament);
//         }),
//         mergeMap((x) => x)
//       );
//   }
// }
