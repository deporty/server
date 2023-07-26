"use strict";
// import {
//   IFixtureModel,
//   IIntergroupMatchModel,
// } from '@deporty-org/entities/tournaments';
// import { Observable, of, zip } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { GetFixtureOverviewByTournamentUsecase } from '../get-fixture-overview-by-tournament.usecase';
// import { GetIntergroupMatchUsecase } from '../get-intergroup-match/get-intergroup-match.usecase';
// import { GetIntergroupMatchesUsecase } from '../get-intergroup-matches/get-intergroup-match.usecase';
// export interface Response {
//   [index: string]: {
//     order: number;
//     matches: IIntergroupMatchModel[];
//   };
// }
// export class GetFullIntergroupMatchesUsecase extends Usecase<string, Response> {
//   constructor(
//     private getIntergroupMatchesUsecase: GetIntergroupMatchesUsecase,
//     private getIntergroupMatchUsecase: GetIntergroupMatchUsecase,
//     private getFixtureOverviewByTournamentUsecase: GetFixtureOverviewByTournamentUsecase
//   ) {
//     super();
//   }
//   call(tournamentId: string): Observable<Response> {
//     return this.getFixtureOverviewByTournamentUsecase.call(tournamentId).pipe(
//       map((fixtureModel: IFixtureModel) => {
//         const response: any[] = [];
//         for (const stage of fixtureModel.stages) {
//           response.push(
//             this.getIntergroupMatchesUsecase
//               .call({
//                 stageId: stage.id || '',
//                 tournamentId: tournamentId,
//               })
//               .pipe(
//                 map((t) => {
//                   const fullMatches: Observable<IIntergroupMatchModel>[] = [];
//                   for (const match of t) {
//                     fullMatches.push(
//                       this.getIntergroupMatchUsecase.call({
//                         tournamentId,
//                         stageId: stage.id || '',
//                         intergroupMatchId: match.id,
//                       })
//                     );
//                   }
//                   return fullMatches.length > 0
//                     ? zip(...fullMatches).pipe(
//                         map((u) => {
//                           return {
//                             order: stage.order,
//                             id: stage.id,
//                             matches: u,
//                             //     matches:
//                           };
//                         })
//                       )
//                     : of([]);
//                 }),
//                 mergeMap((t) => t)
//               )
//           );
//         }
//         return response.length > 0 ? zip(...response) : of([]);
//       }),
//       mergeMap((x) => x),
//       map((x: any) => {
//         const response: Response = {};
//         for (const stage of x) {
//           if (stage.id && !(stage.id in response)) {
//             response[stage.id || ''] = {
//               order: stage.order,
//               matches: stage.matches,
//             };
//           }
//         }
//         return response;
//       })
//     );
//   }
// }
