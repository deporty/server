"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors = require("cors");
const express = require("express");
const DI_1 = require("../core/DI");
const player_controller_1 = require("./infrastructure/player.controller");
const players_modules_config_1 = require("./players-modules.config");
function main(generalContainer) {
    const app = express();
    app.use(cors());
    const ownContainer = new DI_1.Container();
    ownContainer.addAll(generalContainer);
    players_modules_config_1.PlayersModulesConfig.config(ownContainer);
    player_controller_1.PlayerController.registerEntryPoints(app, ownContainer);
    return { app, controller: player_controller_1.PlayerController.registerEntryPoints };
}
exports.main = main;
