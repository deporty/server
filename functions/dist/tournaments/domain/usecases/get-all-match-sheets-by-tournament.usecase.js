"use strict";
// import {
//   IFixtureModel,
//   IGroupModel,
//   IMatchModel,
//   ITournamentModel,
// } from '@deporty/entities/tournaments';
// import { existsSync, mkdirSync, writeFileSync } from 'fs';
// import { Observable, of, zip } from 'rxjs';
// import { map, mergeMap, tap } from 'rxjs/operators';
// import { Usecase } from '../../../core/usecase';
// import { CreateMatchSheetUsecase } from './create-match-sheet/create-match-sheet.usecase';
// import { GetFixtureOverviewByTournamentUsecase } from './get-fixture-overview-by-tournament.usecase';
// import { GetFullIntergroupMatchesUsecase } from './get-full-intergroup-matches/get-full-intergroup-matches.usecase';
// import { GetGroupSpecificationInsideTournamentUsecase } from './get-group-specification-inside-tournament/get-group-specification-inside-tournament.usecase';
// import { GetMatchInsideGroup } from './get-match-inside-group/get-match-inside-group.usecase';
// import { GetTournamentsOverviewUsecase } from './get-tournaments-overview/get-tournaments-overview.usecase';
// import moment = require('moment');
// import { GetFullMaindrawpMatchesUsecase } from './get-full-maindraw-matches/get-full-maindraw-matches.usecase';
// export interface TournamentMatches {
//   stages: {
//     [stageId: string]: {
//       order: number;
//       groups: {
//         [groupLabel: string]: IMatchModel[];
//       };
//       intergroup: IMatchModel[];
//     };
//   };
//   mainDraw: {
//     [level: string]: IMatchModel[];
//   };
// }
// export class GetAllMatchSheetsByTournamentUsecase extends Usecase<
//   void,
//   boolean
// > {
//   constructor(
//     private getTournamentsOverviewUsecase: GetTournamentsOverviewUsecase,
//     private getFixtureOverviewByTournamentUsecase: GetFixtureOverviewByTournamentUsecase,
//     private getGroupSpecificationInsideTournamentUsecase: GetGroupSpecificationInsideTournamentUsecase,
//     private getMatchInsideGroup: GetMatchInsideGroup,
//     private createMatchSheetUsecase: CreateMatchSheetUsecase,
//     private getFullIntergroupMatchesUsecase: GetFullIntergroupMatchesUsecase,
//     private getFullMaindrawpMatchesUsecase: GetFullMaindrawpMatchesUsecase
//   ) {
//     super();
//   }
//   call(): Observable<boolean> {
//     return this.getTournamentsOverviewUsecase.call().pipe(
//       map((tournaments1: ITournamentModel[]) => {
//         const tournaments = [
//           // {
//           //   id: '7KqZutvODrgNeypckDrO',
//           //   name: 'Copa Ciudad Manizales V2 Sub 9 Bronce',
//           // },
//            // {
//           //   id: 'HDhqlJ4JK8grXcnMRVbw',
//           //   name: 'Copa Ciudad Manizales V2 Sub 9 Plata',
//           // },
//           // {
//           //   id: 'ozmao6YxwCrpjIKGfLNt',
//           //   name: 'Copa Ciudad Manizales V2 Sub 9 Oro',
//           // },
//           // {
//           //   id: 'Wl4ZhDEjmAG9iIPSjS4K',
//           //   name: 'Copa Ciudad Manizales V2 Sub 11 Bronce',
//           // },
//           // {
//           //   id: 'cxXCb6VJm58jPPbsTmxj',
//           //   name: 'Copa Ciudad Manizales V2 Sub 11 Oro',
//           // },
//           //     {
//           //   id: 'sLU6ILopc6wSx8htHpFh',
//           //   name: 'Copa Ciudad Manizales V2 Sub 11 Plata',
//           // },
//           // {
//           //   id: 'xH51iDAIW4zvT99iIFNU',
//           //   name: 'Copa Ciudad Manizales V2 Sub 13 Bronce',
//           // },
//           //  {
//           //   id: 'uVvaemEgV5nWAj3OBcIj',
//           //   name: 'Copa Ciudad Manizales V2 Sub 13 Oro',
//           // },
//           //      {
//           //   id: '4cMHPCgqTcJCA6z7iXGW',
//           //   name: 'Copa Ciudad Manizales V2 Sub 13 Plata',
//           // },
//           //  {
//           //   id: '7LvfAXlf7QFVGEOPabdE',
//           //   name: 'Copa Ciudad Manizales V2 Sub 15 Bronce',
//           // },
//           //   {
//           //   id: 'v6YwuGIVlndXp9GzLT8d',
//           //   name: 'Copa Ciudad Manizales V2 Sub 15 Oro',
//           // },
//           //  {
//           //   id: 'DupM3SJtUcY3uD4eojSf',
//           //   name: 'Copa Ciudad Manizales V2 Sub 15 Plata',
//           // },
//           // {
//           //   id: 'LjzFP6fG7xjy8XCj2T9Z',
//           //   name: 'Copa Ciudad Manizales V2 Sub 17 Oro',
//           // },
//           {
//             id: 'lqkIOI9ADrj1CvEPqWEX',
//             name: 'Copa Ciudad Manizales V2 Sub 17 Plata',
//           },
//         ];
//         const response = [];
//         const root = 'match-sheets';
//         for (const tournament of tournaments) {
//           const tournamentId = tournament.id;
//           const matchesByTournament = this.getAllMatchesByTOurnamentes(
//             tournament.id
//           ).pipe(
//             map((data) => {
//               console.log('Tournament ', tournamentId, data);
//               const allData: any[] = [];
//               const allDataIntergroups: any[] = [];
//               const allDataMainDraw: any[] = [];
//               this.createMainDrawSheetMatch;
//               for (const level in data.mainDraw) {
//                 if (
//                   Object.prototype.hasOwnProperty.call(data.mainDraw, level)
//                 ) {
//                   const matches = data.mainDraw[level];
//                   for (const match of matches) {
//                     allDataMainDraw.push(
//                       this.createMainDrawSheetMatch(tournamentId, match, level)
//                     );
//                   }
//                 }
//               }
//               this.createGroupSheetMatch;
//               this.createIntergroupSheetMatch;
//               for (const stageId in data.stages) {
//                 const stageData = data.stages[stageId];
//                 console.log(stageData,6);
//                 if (stageData) {
//                   for (const groupLabel in stageData.groups) {
//                     const matches = stageData.groups[groupLabel];
//                     for (const match of matches) {
//                       allData.push(
//                         this.createGroupSheetMatch(
//                           tournamentId,
//                           match,
//                           stageId,
//                           stageData.order,
//                           groupLabel
//                         )
//                       );
//                     }
//                   }
//                   for (const match of stageData.intergroup) {
//                     allDataIntergroups.push(
//                       this.createIntergroupSheetMatch(
//                         tournamentId,
//                         match,
//                         stageId,
//                         stageData.order
//                       )
//                     );
//                   }
//                 }
//               }
//               return zip(
//                 allData.length > 0 ? zip(...allData) : of([]),
//                 allDataIntergroups.length > 0
//                   ? zip(...allDataIntergroups)
//                   : of([]),
//                 allDataMainDraw.length > 0 ? zip(...allDataMainDraw) : of([])
//               );
//             }),
//             mergeMap((x) => x),
//             map(([cc, allIntergroups, allDataMainDraw]: [any, any, any]) => {
//                 for (const c of cc) {
//                   const path = `${root}/${tournament.name} (${c.tournamentId})/${c.order} (${c.stageId})/${c.groupLabel}`;
//                   const fullPath = `${path}/${c.match.teamA.name}-${
//                     c.match.teamB.name
//                   } (${moment(c.match.date).format('dddd D MM YYYY')}).pdf`;
//                   this.makeFolder(path);
//                   let base64Image = c.base64.split(';base64,').pop();
//                   writeFileSync(fullPath, base64Image, {
//                     encoding: 'base64',
//                   });
//                 }
//               for (const c of allIntergroups) {
//                 const path = `${root}/${tournament.name} (${c.tournamentId})/${c.order} (${c.stageId})/intergrupos`;
//                 const fullPath = `${path}/${c.match.teamA.name}-${
//                   c.match.teamB.name
//                 } (${moment(c.match.date).format('dddd D MM YYYY')}).pdf`;
//                 this.makeFolder(path);
//                 let base64Image = c.base64.split(';base64,').pop();
//                 writeFileSync(fullPath, base64Image, {
//                   encoding: 'base64',
//                 });
//               }
//               const levelMapper: any = {
//                 '0': 'Final',
//                 '0.5': 'Tercor-Cuarto',
//                 '1': 'Semifinal',
//                 '2': 'Cuartos',
//                 '3': 'Octavos',
//               };
//               for (const c of allDataMainDraw) {
//                 const path = `${root}/${tournament.name} (${
//                   c.tournamentId
//                 })/eliminatorias/${levelMapper[String(c.level)]}`;
//                 const fullPath = `${path}/${c.match.teamA.name}-${
//                   c.match.teamB.name
//                 } (${moment(c.match.date).format('dddd D MM YYYY')}).pdf`;
//                 this.makeFolder(path);
//                 let base64Image = c.base64.split(';base64,').pop();
//                 writeFileSync(fullPath, base64Image, {
//                   encoding: 'base64',
//                 });
//               }
//               return true;
//             })
//           );
//           response.push(matchesByTournament);
//         }
//         return response.length > 0 ? zip(...response) : of([]);
//       }),
//       mergeMap((x) => x),
//       map((x) => {
//         return true;
//       })
//     );
//   }
//   private createGroupSheetMatch(
//     tournamentId: string,
//     match: IMatchModel,
//     stageId: string,
//     order: number,
//     groupLabel: string
//   ): Observable<any> {
//     return this.createMatchSheetUsecase
//       .call({
//         tournamentId,
//         match,
//       })
//       .pipe(
//         map((dt) => {
//           return {
//             tournamentId,
//             stageId,
//             groupLabel,
//             match,
//             order,
//             base64: dt,
//           };
//         })
//       );
//   }
//   private createMainDrawSheetMatch(
//     tournamentId: string,
//     match: IMatchModel,
//     level: string
//   ): Observable<any> {
//     return this.createMatchSheetUsecase
//       .call({
//         tournamentId,
//         match,
//       })
//       .pipe(
//         map((dt) => {
//           return {
//             tournamentId,
//             match,
//             level,
//             base64: dt,
//           };
//         })
//       );
//   }
//   private createIntergroupSheetMatch(
//     tournamentId: string,
//     match: IMatchModel,
//     stageId: string,
//     order: number
//   ): Observable<any> {
//     return this.createMatchSheetUsecase
//       .call({
//         tournamentId,
//         match,
//       })
//       .pipe(
//         map((dt) => {
//           return {
//             tournamentId,
//             stageId,
//             match,
//             order,
//             base64: dt,
//           };
//         })
//       );
//   }
//   makeFolder(path: string) {
//     if (!existsSync(path)) {
//       mkdirSync(path, {
//         recursive: true,
//       });
//     }
//   }
//   getAllMatchesByTOurnamentes(
//     tournamentId: string
//   ): Observable<TournamentMatches> {
//     const $integroupMatches = this.getFullIntergroupMatchesUsecase
//       .call(tournamentId)
//       .pipe(
//         map((d) => {
//           const response: any = {};
//           for (const stageId in d) {
//             const element = d[stageId];
//             response[stageId] = {
//               order: element.order,
//               matches: element.matches.map((x) => x.match as IMatchModel),
//             };
//           }
//           return response;
//         })
//       );
//     const $maindDrawMatches =
//       this.getFullMaindrawpMatchesUsecase.call(tournamentId);
//     const $groupedMaches = this.getFixtureOverviewByTournamentUsecase
//       .call(tournamentId)
//       .pipe(
//         map((fixture: IFixtureModel) => {
//           const response = [];
//           if (fixture.stages) {
//             for (const stage of fixture.stages) {
//               console.log('Vacaciones ', stage.id);
//               for (const group of stage.groups) {
//                 const $groupSpecification =
//                   this.getGroupSpecificationInsideTournamentUsecase
//                     .call({
//                       groupLabel: group.label,
//                       stageId: stage.id || '',
//                       tournamentId,
//                     })
//                     .pipe(
//                       map((groupSpecification: IGroupModel) => {
//                         const response = [];
//                         for (const match of groupSpecification.matches || []) {
//                           response.push(
//                             this.getMatchInsideGroup
//                               .call({
//                                 groupLabel: group.label,
//                                 stageId: stage.id || '',
//                                 teamAId: match.teamA.id,
//                                 teamBId: match.teamB.id,
//                                 tournamentId: tournamentId,
//                               })
//                               .pipe(tap((f) => {}))
//                           );
//                         }
//                         return zip(
//                           response.length > 0 ? zip(...response) : of([]),
//                           of({
//                             stageId: stage.id || '',
//                             order: stage.order,
//                             groupLabel: group.label,
//                           })
//                         );
//                       }),
//                       mergeMap((x) => x),
//                       map((c) => {
//                         return {
//                           ...c[1],
//                           matches: c[0],
//                         };
//                       })
//                     );
//                 response.push($groupSpecification);
//               }
//             }
//           }
//           return response.length > 0 ? zip(...response) : of([]);
//         }),
//         mergeMap((x) => x),
//         map(
//           (
//             x: {
//               stageId: string;
//               order: number;
//               groupLabel: string;
//               matches: IMatchModel[] | undefined;
//             }[]
//           ) => {
//             const response: TournamentMatches = {
//               stages: {},
//               mainDraw: {},
//             };
//             for (const item of x) {
//               console.log(item.order, 5);
//               if (!response.stages[item.stageId]) {
//                 response.stages[item.stageId] = {
//                   order: item.order,
//                   groups: {},
//                   intergroup: [],
//                 };
//               }
//               if (item.matches) {
//                 response.stages[item.stageId].groups[item.groupLabel] =
//                   item.matches;
//               }
//             }
//             return response;
//           }
//         )
//       );
//     return zip($integroupMatches, $groupedMaches, $maindDrawMatches).pipe(
//       map(([integroupMatches, groupedMaches, maindDrawMatches]) => {
//         const response: TournamentMatches = { ...groupedMaches };
//         console.log(integroupMatches,'Bonita');
//         for (const stageId in integroupMatches) {
//           const element = integroupMatches[stageId];
//           response.stages[stageId].intergroup = element.matches;
//         }
//         for (const level in maindDrawMatches) {
//           const element = maindDrawMatches[level];
//           response.mainDraw[level] = element.matches;
//         }
//         return response;
//       })
//     );
//   }
// }
