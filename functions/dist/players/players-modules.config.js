"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersModulesConfig = void 0;
const player_mapper_1 = require("./infrastructure/player.mapper");
const player_repository_1 = require("./infrastructure/repository/player.repository");
const player_contract_1 = require("./player.contract");
const create_player_usecase_1 = require("./usecases/create-player/create-player.usecase");
const delete_player_usecase_1 = require("./usecases/delete-player/delete-player.usecase");
const get_player_by_document_usecase_1 = require("./usecases/get-player-by-document/get-player-by-document.usecase");
const get_player_by_email_usecase_1 = require("./usecases/get-player-by-email/get-player-by-email.usecase");
const get_player_by_id_usecase_1 = require("./usecases/get-player-by-id/get-player-by-id.usecase");
class PlayersModulesConfig {
    static config(container) {
        container.add({
            id: 'PlayerMapper',
            kind: player_mapper_1.PlayerMapper,
            dependencies: ['Firestore'],
            strategy: 'singleton',
        });
        container.add({
            id: 'PlayerContract',
            kind: player_contract_1.PlayerContract,
            override: player_repository_1.PlayerRepository,
            dependencies: ['DataSource', 'PlayerMapper', 'FileAdapter'],
            strategy: 'singleton',
        });
        container.add({
            id: 'DeletePlayerUsecase',
            kind: delete_player_usecase_1.DeletePlayerUsecase,
            dependencies: ['PlayerContract', 'FileAdapter', 'GetPlayerByIdUsecase'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPlayerByDocumentUsecase',
            kind: get_player_by_document_usecase_1.GetPlayerByDocumentUsecase,
            dependencies: ['PlayerContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPlayerByEmailUsecase',
            kind: get_player_by_email_usecase_1.GetPlayerByEmailUsecase,
            dependencies: ['PlayerContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPlayerByIdUsecase',
            kind: get_player_by_id_usecase_1.GetPlayerByIdUsecase,
            dependencies: ['PlayerContract'],
            strategy: 'singleton',
        });
        container.add({
            id: 'CreatePlayerUsecase',
            kind: create_player_usecase_1.CreatePlayerUsecase,
            dependencies: [
                'PlayerContract',
                'FileAdapter',
                'GetPlayerByDocumentUsecase',
                'GetPlayerByEmailUsecase',
            ],
            strategy: 'singleton',
        });
        container.add({
            id: 'DeletePlayerUsecase',
            kind: delete_player_usecase_1.DeletePlayerUsecase,
            dependencies: ['PlayerContract', 'FileAdapter', 'GetPlayerByIdUsecase'],
            strategy: 'singleton',
        });
    }
}
exports.PlayersModulesConfig = PlayersModulesConfig;
