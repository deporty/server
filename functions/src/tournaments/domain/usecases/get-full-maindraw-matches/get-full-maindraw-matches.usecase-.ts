// import { IMatchModel } from '@deporty-org/entities/tournaments';
// import { Observable, of, zip } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { GetMainDrawNodeMatchesoverviewusecase } from '../get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';
// import { GetMatchInMainDrawInsideTournamentUsecase } from '../get-match-in-main-draw-inside-tournament/get-match-in-main-draw-inside-tournament.usecase';

// export interface Response {
//   [index: string]: {
//     matches: IMatchModel[];
//   };
// }

// export class GetFullMaindrawpMatchesUsecase extends Usecase<string, Response> {
//   constructor(
//     private getMainDrawNodeMatchesoverviewusecase: GetMainDrawNodeMatchesoverviewusecase,
//     private getMatchInMainDrawInsideTournamentUsecase: GetMatchInMainDrawInsideTournamentUsecase
//   ) {
//     super();
//   }
//   call(tournamentId: string): Observable<Response> {
//     return this.getMainDrawNodeMatchesoverviewusecase.call(tournamentId).pipe(
//       map((matches) => {
//         const response = [];

//         for (const match of matches) {
//           response.push(
//             this.getMatchInMainDrawInsideTournamentUsecase
//               .call({
//                 tournamentId,
//                 nodeMatchId: match.id,
//               })
//               .pipe(
//                 map((h) => {
//                   return {
//                     ...match,
//                     match: h?.match,
//                   };
//                 })
//               )
//           );
//         }
//         return response.length > 0 ? zip(...response) : of([]);
//       }),
//       mergeMap((x) => x),
//       map((c) => {
//         const response: Response = {};

//         for (const match of c) {
//           if (!(String(match.level) in response)) {
//             response[String(match.level)] = {
//               matches: [],
//             };
//           }
//           if (match.match) {
//             response[String(match.level)].matches.push(match.match);
//           }
//         }
//         return response;
//       })
//     );
//   }
// }
