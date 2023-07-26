// import { ITeamModel } from '@deporty-org/entities/teams';
// import {
//   IGroupModel,
//   IMatchModel,
//   ITournamentModel,
// } from '@deporty-org/entities/tournaments';
// import * as fs from 'fs';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
// import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';
// export interface Param {
//   tournamentId: string;
//   fixtureStageOrder: number;
//   groupLabel: string;
// }
// export class CreateFixtureByGroupUsecase extends Usecase<Param, IMatchModel[]> {
//   constructor(
//     private getTournamentByIdUsecase: GetTournamentByIdUsecase,
//     private updateTournamentUsecase: UpdateTournamentUsecase
//   ) {
//     super();
//   }
//   call(param: Param): Observable<IMatchModel[]> {
//     return this.getTournamentByIdUsecase.call(param.tournamentId).pipe(
//       catchError((error) => throwError(error)),
//       map((tournament: ITournamentModel) => {
//         return {
//           ...this.getTeamsAndMatches(
//             tournament,
//             param.fixtureStageOrder,
//             param.groupLabel
//           ),
//           tournament,
//         };
//       }),
//       map((data: any) => {
//         const {
//           teams,
//           matches,
//           group,
//           tournament,
//         }: {
//           teams: ITeamModel[];
//           matches: IMatchModel[];
//           group: IGroupModel;
//           tournament: ITournamentModel;
//         } = data;

//         const matchesTemp: IMatchModel[] = !!matches ? [...matches] : [];
//         for (let i = 0; i < teams.length - 1; i++) {
//           const teamA = teams[i];

//           for (let j = i + 1; j < teams.length; j++) {
//             const teamB = teams[j];
//             const exists: boolean = existSMatchInList(
//               teamA,
//               teamB,
//               matchesTemp
//             );

//             if (!exists) {
//               matchesTemp.push({
//                 completed: false,
//                 observations: '',
//                 teamA,
//                 teamB,
//               });
//             }
//           }
//         }
//         return { matches: matchesTemp, tournament, group };
//       }),
//       map((data: any) => {
//         const matches = data.matches;
//         const tournament: ITournamentModel = data.tournament;
//         const group: IGroupModel = data.group;

//         if (!group.matches) {
//           group.matches = [...matches];
//         } else {
//           for (const match of matches) {
//             if (!existSMatchInList(match.teamA, match.teamB, group.matches)) {
//               group.matches.push(match);
//             }
//           }
//         }

//         fs.writeFileSync('klaus.json', JSON.stringify(tournament, null, 2));
//         // return of(matches);
//         return this.updateTournamentUsecase.call(tournament).pipe(
//           map(() => {
//             return matches;
//           })
//         );
//       }),
//       mergeMap((x) => x)
//     );

//     function existSMatchInList(
//       teamA: ITeamModel,
//       teamB: ITeamModel,
//       matches: IMatchModel[]
//     ): boolean {
//       return (
//         matches.filter((match) => {
//           return (
//             (match.teamA.id === teamA.id && match.teamB.id === teamB.id) ||
//             (match.teamA.id === teamB.id && match.teamB.id === teamA.id)
//           );
//         }).length > 0
//       );
//     }
//   }

//   getTeamsAndMatches(
//     tournament: ITournamentModel,
//     fixtureStageOrder: number,
//     groupLabel: string
//   ) {
//     const stage = tournament.fixture?.stages
//       .filter((stage) => {
//         return stage.order == fixtureStageOrder;
//       })
//       .pop();

//     const group = !!stage
//       ? stage.groups
//           .filter((group) => {
//             return group.label.toUpperCase() === groupLabel.toUpperCase();
//           })
//           .pop()
//       : null;

//     const teams = group?.teams;
//     const matches = group?.matches;

//     return { teams, matches, group };
//   }
// }
