"use strict";
// import { ITournamentAllInvoicesModel } from '@deporty-org/entities/invoices';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { CalculateTournamentInvoices } from '../calculate-tournament-invoices/calculate-tournament-invoices.usecase';
// import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
// export class CalculateTournamentInvoicesById extends Usecase<
//   string,
//   ITournamentAllInvoicesModel
// > {
//   constructor(
//     private getTournamentByIdUsecase: GetTournamentByIdUsecase,
//     private calculateTournamentInvoices: CalculateTournamentInvoices
//   ) {
//     super();
//   }
//   call(tournamentId: string): Observable<ITournamentAllInvoicesModel> {
//     return this.getTournamentByIdUsecase.call(tournamentId).pipe(
//       catchError((error) => {
//         return throwError(error);
//       }),
//       map((tournament) => {
//         return this.calculateTournamentInvoices.call(tournament);
//       }),
//       mergeMap((x) => x)
//     );
//   }
// }
