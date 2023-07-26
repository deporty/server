"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationModulesConfig = void 0;
// import { GetTournamentsInvoiceByOrganizerUsecase } from './usecases/get-tournament-bill-by-organizer/get-tournament-invoice-by-organizer.usecase';
class AuthorizationModulesConfig {
    static config(container) {
        container.add({
            id: 'GetTournamentsInvoiceByOrganizerUsecase',
            kind: GetTournamentsInvoiceByOrganizerUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetTournamentsInvoiceByOrganizerUsecase',
            kind: GetTournamentsInvoiceByOrganizerUsecase,
            dependencies: ['TournamentContract'],
            strategy: 'singleton',
        });
    }
}
exports.AuthorizationModulesConfig = AuthorizationModulesConfig;
