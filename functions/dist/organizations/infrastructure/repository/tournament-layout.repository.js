"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentLayoutsRepository = void 0;
const organizations_constants_1 = require("../organizations.constants");
const tournament_layout_contract_1 = require("../../domain/contracts/tournament-layout.contract");
class TournamentLayoutsRepository extends tournament_layout_contract_1.TournamentLayoutContract {
    constructor(datasource, mapper) {
        super(datasource, mapper);
        this.datasource = datasource;
        this.mapper = mapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: organizations_constants_1.ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
            { collection: organizations_constants_1.TOURNAMENT_LAYOUTS_ENTITY, id },
        ]);
    }
    delete(accessParams) {
        throw new Error('Method not implemented.');
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: organizations_constants_1.ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
            { collection: organizations_constants_1.TOURNAMENT_LAYOUTS_ENTITY },
        ], pagination);
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: organizations_constants_1.ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
            { collection: organizations_constants_1.TOURNAMENT_LAYOUTS_ENTITY },
        ], {
            filters: filter,
        });
    }
    update(accessParams, entity) {
        return super.innerUpdate([
            { collection: organizations_constants_1.ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
            { collection: organizations_constants_1.TOURNAMENT_LAYOUTS_ENTITY, id: accessParams.tournamentLayoutId },
        ], entity);
    }
    save(accessParams, entity) {
        return super.innerSave([
            { collection: organizations_constants_1.ORGANIZATIONS_ENTITY, id: accessParams.organizationId },
            { collection: organizations_constants_1.TOURNAMENT_LAYOUTS_ENTITY },
        ], entity);
    }
}
exports.TournamentLayoutsRepository = TournamentLayoutsRepository;
TournamentLayoutsRepository.entity = organizations_constants_1.TOURNAMENT_LAYOUTS_ENTITY;
