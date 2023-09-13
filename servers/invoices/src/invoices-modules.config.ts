// import { GetTournamentsInvoiceByOrganizerUsecase } from './usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';

import { Container } from "@scifamek-open-source/iraca/dependency-injection";

export class InvoicesModulesConfig {
  static config(container: Container) {
    // container.add({
    //   id: 'GetTournamentsInvoiceByOrganizerUsecase',
    //   kind: GetTournamentsInvoiceByOrganizerUsecase,
    //   dependencies: ['TournamentContract'],
    //   strategy: 'singleton',
    // });
  }
}
