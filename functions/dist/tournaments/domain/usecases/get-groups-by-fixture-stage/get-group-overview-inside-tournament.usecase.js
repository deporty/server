"use strict";
// import { IGroupModel } from '@deporty/entities/tournaments';
// import { Observable, of, throwError } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { TournamentContract } from '../../tournament.contract';
// import { LabeledGroupDoesNotExist } from '../../tournaments.exceptions';
// export interface Param {
//   tournamentId: string;
//   stageId: string;
//   groupLabel: string;
// }
// export class GetGroupOverviewInsideTournamentUsecase extends Usecase<
//   Param,
//   IGroupModel
// > {
//   constructor(private tournamentContract: TournamentContract) {
//     super();
//   }
//   call(param: Param): Observable<IGroupModel> {
//     return this.tournamentContract
//       .getGroupOverview(param.tournamentId, param.stageId, param.groupLabel)
//       .pipe(
//         map((group) => {
//           if (!!group) {
//             return of(group);
//           }
//           return throwError(new LabeledGroupDoesNotExist(param.groupLabel));
//         }),
//         mergeMap((x) => x)
//       );
//   }
// }
