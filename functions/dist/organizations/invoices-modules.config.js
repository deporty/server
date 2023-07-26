"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesModulesConfig = void 0;
const calculate_tournament_invoices_by_organizer_and_tournament_usecase_1 = require("./usecases/calculate-tournament-invoices-by-organizer-and-tournament/calculate-tournament-invoices-by-organizer-and-tournament.usecase");
class InvoicesModulesConfig {
    static config(container) {
        container.add({
            id: 'CalculateTournamentInvoicesByOrganizerAndTournament',
            kind: calculate_tournament_invoices_by_organizer_and_tournament_usecase_1.CalculateTournamentInvoicesByOrganizerAndTournament,
            dependencies: ['GetTournamentOverviewByIdUsecase'],
            strategy: 'singleton',
        });
    }
}
exports.InvoicesModulesConfig = InvoicesModulesConfig;
