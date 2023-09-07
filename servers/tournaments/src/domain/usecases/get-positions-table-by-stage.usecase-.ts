// import { TeamEntity } from '@deporty-org/entities/teams';
// import {
//   FixtureStageEntity,
//   IntergroupMatchEntity,
//   MatchEntity,
//   IPointsStadisticsModel,
// } from '@deporty-org/entities/tournaments';
// import { Observable, of, zip } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '@scifamek-open-source/iraca/domain';
// import { GetFixtureStagesByTournamentUsecase } from './get-fixture-stages-by-tournament.usecase';
// import { GetIntergroupMatchesUsecase } from './get-intergroup-matches/get-intergroup-match.usecase';
// import { GetPositionsTableUsecase } from './get-positions-table';
// import { GetRegisteredTeamsByTournamentIdUsecase } from './get-registered-teams-by-tournaments.usecase';
// export interface PositionTableByStage {
//   [index: string]: {
//     [index: string]: IPointsStadisticsModel[];
//   };
// }
// export class GetPositionsTableByStageUsecase extends Usecase<
//   string,
//   PositionTableByStage
// > {
//   constructor(
//     private getFixtureOverviewByTournamentUsecase: GetFixtureStagesByTournamentUsecase,
//     private getRegisteredTeamsByTournamentIdUsecase: GetRegisteredTeamsByTournamentIdUsecase,
//     private getIntergroupMatchesUsecase: GetIntergroupMatchesUsecase,
//     private getPositionsTableUsecase: GetPositionsTableUsecase
//   ) {
//     super();
//   }

//   call(tournamentId: string): Observable<PositionTableByStage> {
//     const $registeredTeams = this.getRegisteredTeamsByTournamentIdUsecase
//       .call(tournamentId)
//       .pipe(
//         map((x) => {
//           return x.map((y) => {
//             return y.team;
//           });
//         })
//       );

//     const $anemicTable: Observable<PositionTableByStage> =
//       this.getFixtureOverviewByTournamentUsecase.call(tournamentId).pipe(
//         map((fixture: IFixtureModel) => {
//           const generalResponse = [];
//           for (const stage of fixture.stages) {
//             const $intergroupMatches = this.getIntergroupMatchesUsecase.call({
//               stageId: stage.id || '',
//               tournamentId,
//             });

//             generalResponse.push(
//               zip($intergroupMatches, of(stage.groups)).pipe(
//                 map(([intergroupMatches, groupedMatches]) => {
//                   const tables = [];
//                   for (const groupSpecification of groupedMatches) {
//                     const teams: TeamEntity[] = groupSpecification.teams;
//                     const matches: IMatchModel[] = groupSpecification.matches || [];

//                     const matchesI = intergroupMatches
//                       .map((x: IIntergroupMatchModel) => {
//                         return x.match;
//                       })
//                       .filter((x: IMatchModel | undefined) => {
//                         return x != undefined;
//                       });
//                     for (const item of matchesI) {
//                       if (item) {
//                         matches.push(item);
//                       }
//                     }

//                     tables.push(
//                       this.getPositionsTableUsecase
//                         .call({
//                           availableTeams: teams,
//                           matches,
//                         })
//                         .pipe(
//                           map((x) => {
//                             return {
//                               group: groupSpecification.label,
//                               table: x,
//                             };
//                           })
//                         )
//                     );
//                   }
//                   return tables.length > 0 ? zip(...tables) : of([]);
//                 }),
//                 mergeMap((x) => x),
//                 map((x) => {
//                   return {
//                     stage: stage.id || '',
//                     tables: x,
//                   };
//                 })
//               )
//             );
//           }
//           return generalResponse.length > 0 ? zip(...generalResponse) : of([]);
//         }),
//         mergeMap((x) => x),
//         map((x) => {
//           const absoluteResponse: any = {};

//           for (const stage of x) {
//             absoluteResponse[stage.stage] = {};
//             for (const group of stage.tables) {
//               absoluteResponse[stage.stage][group.group] = group.table;
//             }
//           }
//           return absoluteResponse;
//         })
//       );

//     return zip($anemicTable, $registeredTeams).pipe(
//       map(([oldTable, registeredTeams]) => {
//         const table = { ...oldTable };
//         for (const stageId in table) {
//           if (Object.prototype.hasOwnProperty.call(table, stageId)) {
//             const groups = table[stageId];
//             for (const groupLabel in groups) {
//               for (let i = 0; i < groups[groupLabel].length; i++) {
//                 const positions = groups[groupLabel][i];

//                 const index = registeredTeams.findIndex((r) => {
//                   return r.id === positions.team.id;
//                 });

//                 groups[groupLabel][i].team =  registeredTeams[index];
//               }
//             }
//           }
//         }
//         return table;
//       })
//     );
//   }
// }
