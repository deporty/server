// import { IPlayerModel } from '@deporty-org/entities/players';
// import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
// import { TournamentEntity } from '@deporty-org/entities/tournaments';
// import { Observable, of, throwError, zip } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { Filters } from '../../../core/datasource';
// import { Usecase } from '../../../core/usecase';
// import { GetPlayerByIdUsecase } from '../../../players/usecases/get-player-by-id/get-player-by-id.usecase';
// import { UpdateTournamentUsecase } from '../../../tournaments/domain/usecases/update-tournament/update-tournament.usecase';
// import { TeamContract } from '../../infrastructure/contracts/team.contract';
// import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
// import { PlayerIsAlreadyInTeamException } from './asign-player-to-team.exceptions';

// export interface IAsignPlayerToTeam {
//   teamId: string;
//   playerId: string;
//   number?: number;
// }

// export class AsignPlayerToTeamUsecase extends Usecase<
//   IAsignPlayerToTeam,
//   MemberEntity
// > {
//   constructor(
//     public teamContract: TeamContract,
//     private getTeamByIdUsecase: GetTeamByIdUsecase,
//     private getPlayerByIdUsecase: GetPlayerByIdUsecase,
//     private updateTournamentUsecase: UpdateTournamentUsecase,
//     private getActiveTournamentsByRegisteredTeamUsecase: GetActiveTournamentsByRegisteredTeamUsecase
//   ) {
//     super();
//   }
//   call(param: IAsignPlayerToTeam): Observable<MemberEntity> {
//     const $getPlayerByIdUsecase = this.getPlayerByIdUsecase.call(
//       param.playerId
//     );

//     const $getTeamByIdUsecase = this.getTeamByIdUsecase.call(param.teamId);

//     return zip($getPlayerByIdUsecase, $getTeamByIdUsecase).pipe(

//       map(([player, team]: [ IPlayerModel, TeamEntity]) => {
//         const filters: Filters = {
//           'teamId': {
//             operator: '==',
//             value: param.teamId
//           }
//         }
    
//         this.teamContract.filter(filters).pipe(map(()=>{
//         }))

//         const existsPlayer =
//           team.members.filter((p: MemberEntity) => {
//             return p.player.id === player.id;
//           }).length > 0;
//         if (!existsPlayer) {
//           const newMember: MemberEntity = {
//             player,
//             initDate: new Date(),
//             number: param.number,
//             role: '',
//           };

//           team.members.push(newMember);

//           const $tournamentsByRegisteredTeams =
//             this.getActiveTournamentsByRegisteredTeamUsecase.call(team.id);

//           const $teamUpdated = this.teamContract.update(team.id, team);
//           return zip($teamUpdated, $tournamentsByRegisteredTeams).pipe(
//             map((data) => {
//               const tournaments: TournamentEntity[] = data[1];

//               const $tournamentsUpdated = [];
//               for (const tournament of tournaments) {
//                 for (let j = 0; j < tournament.registeredTeams.length; j++) {
//                   const registeredTeam = tournament.registeredTeams[j];

//                   if (registeredTeam.team.id == team.id) {
//                     if (!registeredTeam.team.members) {
//                       registeredTeam.team.members = [];
//                     }
//                     tournament.registeredTeams[j].members.push(newMember);
//                   }
//                 }

//                 $tournamentsUpdated.push(
//                   this.updateTournamentUsecase.call(tournament)
//                 );
//               }
//               if ($tournamentsUpdated.length > 0) {
//                 return zip(...$tournamentsUpdated).pipe(
//                   map(() => {
//                     return newMember;
//                   })
//                 );
//               } else {
//                 return of(newMember);
//               }
//             }),
//             mergeMap((x) => x)
//           );
//         } else {
//           return throwError(
//             new PlayerIsAlreadyInTeamException(player.document)
//           );
//         }
//       }),
//       mergeMap((x) => x)
//     );
//   }
// }
