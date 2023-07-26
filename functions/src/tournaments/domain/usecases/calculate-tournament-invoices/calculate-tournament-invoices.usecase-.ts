// import { ITournamentAllInvoicesModel } from '@deporty-org/entities/invoices';
// import { IInvoiceModel } from '@deporty-org/entities/invoices/invoice.model';
// import { ITournamentModel } from '@deporty-org/entities/tournaments';
// import * as moment from 'moment';
// import { Observable, of } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';
// import { Usecase } from '../../../../core/usecase';
// import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';

// export class CalculateTournamentInvoices extends Usecase<
//   ITournamentModel,
//   ITournamentAllInvoicesModel
// > {
//   constructor(private updateTournamentUsecase: UpdateTournamentUsecase) {
//     super();
//   }
//   call(tournament: ITournamentModel): Observable<ITournamentAllInvoicesModel> {
//     return of(tournament).pipe(
//       map((tournament) => {
//         const invoices = tournament.financialStatements.invoices || [];

//         const paidInvoices = invoices.filter((invoice) => {
//           return invoice.status === 'paid';
//         });

//         const overdueInvoices = invoices.filter((invoice) => {
//           return invoice.status === 'overdue';
//         });

//         const ammount = tournament.financialStatements.ammount;

//         const availableAmountOfInvoices =
//           tournament.financialStatements.numOfInvoices -
//           paidInvoices.length -
//           overdueInvoices.length;
//         const amountToPaid =
//           ammount -
//           paidInvoices.reduce((acc, a) => {
//             return acc + a.amount;
//           }, 0) +
//           overdueInvoices.reduce((acc, a) => {
//             return acc + a.amount + (a.overdue || 0);
//           }, 0);

//         return {
//           amountToPaid,
//           availableAmountOfInvoices,
//           tournament,
//         };
//       }),
//       map((data) => {
//         const num = data.availableAmountOfInvoices;
//         const cost = data.amountToPaid;
//         const tournament = data.tournament;

//         const invoices = [];
//         const invoiceQuota: number = Math.round(cost / num);

//         let date = moment(tournament.startsDate);
//         let next = date.clone().add(1, 'M').add(-1, 'day');

//         for (let i = 0; i < num; i++) {
//           invoices.push({
//             subject: `Cuenta de cobro No. ${i + 1}`,
//             description: `Cuenta de cobro No. ${i + 1} de ${num}`,
//             amount: invoiceQuota,
//             date: date.toDate(),
//             maxPaymentDate: next.toDate(),
//             status: 'pending',
//           } as IInvoiceModel);

//           date = next.clone().add(1, 'day');
//           next = date.clone().add(1, 'M').add(-1, 'day');
//         }

//         return {
//           tournament,
//           invoices: invoices,
//         };
//       }),
//       map((data) => {
//         const tournament = { ...data.tournament };
//         tournament.financialStatements.invoices = data.invoices;
//         return this.updateTournamentUsecase.call(data.tournament).pipe(
//           map(() => {
//             return {
//               tournament,
//               invoices: data.invoices,
//             };
//           })
//         );
//       }),
//       mergeMap((x) => x)
//     );
//   }
// }
