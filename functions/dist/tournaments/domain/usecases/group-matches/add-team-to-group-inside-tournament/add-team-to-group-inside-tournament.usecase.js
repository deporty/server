"use strict";
// import { Id } from '@deporty-org/entities';
// import { GroupEntity } from '@deporty-org/entities/tournaments';
// import { Observable, throwError, zip } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { GetTeamByIdUsecase } from '../../../../teams/usecases/get-team-by-id/get-team-by-id.usecase';
// import {
//   GroupDoesNotExist,
//   StageDoesNotExist,
//   TeamIsAlreadyInOtherGroup,
//   TeamIsAlreadyInTheGroup,
// } from '../../tournaments.exceptions';
// import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
// import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';
// export interface Param {
//   tournamentId: Id;
//   fixtureStageId: Id;
//   groupId: Id;
//   teamId: string;
// }
// export class AddTeamToGroupInsideTournamentUsecase extends Usecase<
//   Param,
//   GroupEntity
// > {
//   constructor(
//     private getTournamentByIdUsecase: GetTournamentByIdUsecase,
//     private getTeamByIdUsecase: GetTeamByIdUsecase,
//     //TODO: Make UC = GetGroupByIdUsecase
//     private getGroupByIdUsecase: any,
//     //TODO: Make UC = GetFixtureStageById
//     private getFixtureStageByIdUsecase: any,
//     private updateTournamentUsecase: UpdateTournamentUsecase
//   ) {
//     super();
//   }
//   call(param: Param): Observable<GroupEntity> {
//     const $team = this.getTeamByIdUsecase.call(param.teamId);
//     const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
//     return zip($team, $tournament).pipe(
//       catchError((error) => {
//         return throwError(error);
//       }),
//       map(([team, tournament]) => {
//         //TODO: Make UC = GetMembersCountByTeam
//         // if (team.members?.length == 0) {
//         //   return throwError(new TeamDoesNotHaveMembers(team.name));
//         // }
//         const stage: IFixtureStageModel[] = tournament.fixture?.stages.filter(
//           (stage) => stage.id == param.fixtureStageId
//         ) as IFixtureStageModel[];
//         if (stage?.length === 0) {
//           return throwError(new StageDoesNotExist(param.fixtureStageId));
//         }
//         const currentStage: IFixtureStageModel =
//           stage.pop() as IFixtureStageModel;
//         const group: IGroupModel[] = currentStage.groups.filter(
//           (g) => g.order == param.groupId
//         );
//         const otherGroup: IGroupModel[] = currentStage.groups.filter(
//           (g) => g.order != param.groupId
//         );
//         if (group.length === 0) {
//           return throwError(new GroupDoesNotExist(param.groupId));
//         }
//         const currentGroup: IGroupModel = group.pop() as IGroupModel;
//         const exists =
//           currentGroup.teams.filter((x) => x.id === team.id).length > 0;
//         if (exists) {
//           return throwError(new TeamIsAlreadyInTheGroup(team.name));
//         }
//         let isInAnotherGroup = false;
//         for (const g of otherGroup) {
//           isInAnotherGroup =
//             isInAnotherGroup ||
//             g.teams.filter((x) => x.id === team.id).length > 0;
//         }
//         if (isInAnotherGroup) {
//           return throwError(new TeamIsAlreadyInOtherGroup(team.name));
//         }
//         currentGroup.teams.push(team);
//         return this.updateTournamentUsecase.call(tournament).pipe(
//           map((data: any) => {
//             return currentGroup;
//           })
//         );
//       }),
//       mergeMap((x) => x)
//     );
//   }
// }
