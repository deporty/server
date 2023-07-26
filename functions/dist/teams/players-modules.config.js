"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersModulesConfig = void 0;
const player_repository_1 = require("./infrastructure/repository/player.repository");
const player_contract_1 = require("./player.contract");
const player_mapper_1 = require("./infrastructure/player.mapper");
const create_player_usecase_1 = require("./usecases/create-player/create-player.usecase");
const delete_player_usecase_1 = require("./usecases/delete-player/delete-player.usecase");
const get_player_by_document_usecase_1 = require("./usecases/get-player-by-document/get-player-by-document.usecase");
const get_players_usecase_1 = require("./usecases/get-players/get-players.usecase");
const get_player_by_email_usecase_1 = require("./usecases/get-player-by-email/get-player-by-email.usecase");
class PlayersModulesConfig {
    static config(container) {
        container.add({
            id: "PlayerMapper",
            kind: player_mapper_1.PlayerMapper,
            strategy: "singleton",
        });
        container.add({
            id: "PlayerContract",
            kind: player_contract_1.PlayerContract,
            override: player_repository_1.PlayerRepository,
            dependencies: ["DataSource", "PlayerMapper"],
            strategy: "singleton",
        });
        container.add({
            id: "GetPlayersUsecase",
            kind: get_players_usecase_1.GetPlayersUsecase,
            dependencies: ["PlayerContract"],
            strategy: "singleton",
        });
        container.add({
            id: "DeletePlayerUsecase",
            kind: delete_player_usecase_1.DeletePlayerUsecase,
            dependencies: ["PlayerContract"],
            strategy: "singleton",
        });
        container.add({
            id: "GetPlayerByDocumentUsecase",
            kind: get_player_by_document_usecase_1.GetPlayerByDocumentUsecase,
            dependencies: ["PlayerContract"],
            strategy: "singleton",
        });
        container.add({
            id: "GetPlayerByEmailUsecase",
            kind: get_player_by_email_usecase_1.GetPlayerByEmailUsecase,
            dependencies: ["PlayerContract"],
            strategy: "singleton",
        });
        container.add({
            id: "CreatePlayerUsecase",
            kind: create_player_usecase_1.CreatePlayerUsecase,
            dependencies: ["PlayerContract", "GetPlayerByDocumentUsecase", "GetPlayerByEmailUsecase"],
            strategy: "singleton",
        });
        // container.add({
        //   id: "DeletePlayerUsecase",
        //   kind: DeletePlayerUsecase,
        //   dependencies: ["PlayersDataSource"],
        //   strategy: "singleton",
        // });
    }
}
exports.PlayersModulesConfig = PlayersModulesConfig;
//# sourceMappingURL=players-modules.config.js.map