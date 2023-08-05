"use strict";
// import { GroupEntity, Id, NodeMatchEntity, TournamentEntity } from '@deporty-org/entities';
// import { Usecase } from '../../../../core/usecase';
// import { Observable, of, throwError, zip } from 'rxjs';
// import { GetGroupsByTournamentIdUsecase, Result } from '../groups/get-groups-by-tournament-id/get-groups-by-tournament-id.usecase';
// import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
// import { map, mergeMap } from 'rxjs/operators';
// import { FixtureStageConfiguration, TournamentLayoutSchema } from '@deporty-org/entities/organizations';
// export class SchemaNoSelectedError extends Error {
//   constructor() {
//     super();
//     this.message = `The tournament does not have a schema selected.`;
//     this.name = 'SchemaNoSelectedError';
//   }
// }
// export class GenerateMainDrawFromSchemaUsecase extends Usecase<Id, NodeMatchEntity[]> {
//   constructor(
//     private getGroupsByTournamentIdUsecase: GetGroupsByTournamentIdUsecase,
//     private getTournamentByIdUsecase: GetTournamentByIdUsecase
//   ) {
//     super();
//   }
//   call(tournamentId: Id): Observable<NodeMatchEntity[]> {
//     const $tournament = this.getTournamentByIdUsecase.call(tournamentId);
//     $tournament.pipe(
//       mergeMap((tournament: TournamentEntity) => {
//         if (!tournament.schema) {
//           return throwError(new SchemaNoSelectedError());
//         }
//         const $groups = this.getGroupsByTournamentIdUsecase.call(tournamentId);
//         return zip($groups, of(tournament));
//       }),
//       map(([data, tournament]) => {
//         const lastFixture = this.getLastFixture(data);
//         const schema: TournamentLayoutSchema = tournament.schema as TournamentLayoutSchema;
//         const lastSchema: FixtureStageConfiguration = [...schema.stages].pop();
//         for (let i = 0; i < lastSchema.groupCount; i++) {
//           const passedTeamsCount: number = lastSchema.passedTeamsCount[i]
//         }
//       })
//     );
//     throw new Error('Method not implemented.');
//   }
//   private getLastFixture(data: Result) {
//     let lastFixture = null;
//     for (const fixtureStageId in data) {
//       const element = data[fixtureStageId];
//       if (lastFixture === null) {
//         lastFixture = element;
//       } else {
//         if (element.fixtureStage.order > lastFixture.fixtureStage.order) {
//           lastFixture = element;
//         }
//       }
//     }
//     return lastFixture;
//   }
// }
