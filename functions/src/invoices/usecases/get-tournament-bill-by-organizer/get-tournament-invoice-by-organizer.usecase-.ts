// import { ITournamentInvoiceModel } from '@deporty-org/entities/invoices';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { DataSourceFilter } from '../../../core/datasource';
// import { Usecase } from '../../../core/usecase';
// import { TournamentContract } from '../../../tournaments/domain/tournament.contract';

// export class GetTournamentsInvoiceByOrganizerUsecase extends Usecase<
//   string,
//   ITournamentInvoiceModel[]
// > {
//   constructor(private tournamentContract: TournamentContract) {
//     super();
//   }
//   call(organizationId: string): Observable<ITournamentInvoiceModel[]> {
//     const filters: DataSourceFilter[] = [
//       {
//         property: 'organization',
//         equals: organizationId,
//       },
//     ];
//     return this.tournamentContract.getByFilter(filters).pipe(
//       map((tournament) => {
//         return tournament.map((item) => {
//           return [];
//         });
//       })
//     );
//   }
// }
