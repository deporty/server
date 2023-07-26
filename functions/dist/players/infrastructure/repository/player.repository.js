"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRepository = void 0;
const player_contract_1 = require("../../player.contract");
const player_constants_1 = require("../player.constants");
class PlayerRepository extends player_contract_1.PlayerContract {
    constructor(dataSource, playerMapper) {
        super(dataSource, playerMapper);
        this.dataSource = dataSource;
        this.playerMapper = playerMapper;
    }
}
exports.PlayerRepository = PlayerRepository;
PlayerRepository.entity = player_constants_1.PLAYER_ENTITY;
