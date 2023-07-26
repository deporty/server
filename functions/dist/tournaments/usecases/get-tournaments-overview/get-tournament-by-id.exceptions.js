"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentDoesNotExist = void 0;
class TournamentDoesNotExist extends Error {
    constructor(id) {
        super();
        this.message = `The tournament with the id ${id} does not exist`;
        this.name = 'TournamentDoesNotExist';
    }
}
exports.TournamentDoesNotExist = TournamentDoesNotExist;
