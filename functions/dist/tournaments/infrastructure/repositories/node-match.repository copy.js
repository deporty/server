"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMatchRepository = void 0;
const node_match_contract_1 = require("../contracts/node-match.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class NodeMatchRepository extends node_match_contract_1.NodeMatchContract {
    constructor(dataSource, groupMapper) {
        super(dataSource, groupMapper);
        this.dataSource = dataSource;
        this.groupMapper = groupMapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.MAIN_DRAW_ENTITY, id },
        ]);
    }
    delete(accessParams) {
        throw new Error('Method not implemented.');
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.MAIN_DRAW_ENTITY },
        ], pagination);
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.MAIN_DRAW_ENTITY },
        ]);
    }
    update(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
    save(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
}
exports.NodeMatchRepository = NodeMatchRepository;
NodeMatchRepository.entity = tournaments_constants_1.MAIN_DRAW_ENTITY;
