"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRepository = void 0;
const operators_1 = require("rxjs/operators");
const team_contract_1 = require("../../team.contract");
class PlayerRepository extends team_contract_1.PlayerContract {
    constructor(dataSource, playerMapper) {
        super();
        this.dataSource = dataSource;
        this.playerMapper = playerMapper;
        this.dataSource.entity = PlayerRepository.entity;
    }
    getPlayers() {
        return this.dataSource.getByFilter([]).pipe((0, operators_1.map)((docs) => {
            return docs.map(this.playerMapper.fromJson);
        }));
    }
    getByFilter(filters) {
        return this.dataSource.getByFilter(filters).pipe((0, operators_1.map)((docs) => {
            return docs.map(this.playerMapper.fromJson);
        }));
    }
    save(player) {
        const mappedPlayer = this.playerMapper.toJson(player);
        return this.dataSource.save(mappedPlayer);
    }
    delete(id) {
        return this.dataSource.deleteById(id);
    }
}
exports.PlayerRepository = PlayerRepository;
PlayerRepository.entity = 'players';
//# sourceMappingURL=player.repository.js.map