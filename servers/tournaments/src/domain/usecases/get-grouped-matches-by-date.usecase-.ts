// import moment = require('moment');
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Usecase } from '@scifamek-open-source/iraca/domain';
// import { TournamentContract } from '../tournament.contract';

// export interface Params {
//   stageId: string;
//   tournamentId: string;
// }

// export class GetGroupedMatchesByDateUsecase extends Usecase<Params, any> {
//   constructor(private tournamentContract: TournamentContract) {
//     super();
//   }

//   call(params: Params): Observable<any> {
//     moment.locale('es');

//     return this.tournamentContract
//       .getAllMatchesWithTeams(params.tournamentId, params.stageId)
//       .pipe(
//         map((data: any) => {
//           const response: any = {};
//           for (const label in data) {
//             if (Object.prototype.hasOwnProperty.call(data, label)) {
//               if (!response[label]) {
//                 response[label] = {};
//               }
//               const matches = data[label];
//               for (const match of matches) {
//                 const date = match['date'];

//                 let transformedDate = 'unscheduled';
//                 if (!!date) {
//                   transformedDate = moment(date).format('dddd D MMM YYYY');
//                 }

//                 if (!response[label][transformedDate]) {
//                   response[label][transformedDate] = [];
//                 }
//                 response[label][transformedDate].push(match);
//               }
//             }
//           }
//           return response;
//         })
//       );
//   }
// }
