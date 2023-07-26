"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamDoesNotExist = void 0;
class TeamDoesNotExist extends Error {
    constructor(id) {
        super();
        this.message = `The team with the id ${id} does not exist`;
        this.name = 'TeamDoesNotExist';
    }
}
exports.TeamDoesNotExist = TeamDoesNotExist;
//# sourceMappingURL=get-team-by-id.exceptions.js.map