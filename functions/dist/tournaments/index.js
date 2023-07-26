"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors = require("cors");
const express = require("express");
const DI_1 = require("../core/DI");
const tournament_controller_1 = require("./infrastructure/tournament.controller");
const tournaments_modules_config_1 = require("./tournaments-modules.config");
const is_key_present_middleware_1 = require("../core/middlewares/is-key-present.middleware");
const env_1 = require("./environments/env");
const is_authorized_user_middleware_1 = require("../core/middlewares/is-authorized-user.middleware");
function main(generalContainer) {
    const app = express();
    app.use(cors());
    const ownContainer = new DI_1.Container();
    ownContainer.addAll(generalContainer);
    tournaments_modules_config_1.TournamentsModulesConfig.config(ownContainer);
    ownContainer.addValue({
        id: 'is-key-present-flag',
        value: env_1.env.middlewares['is-key-present'],
    });
    const authorizationContract = ownContainer.getInstance('AuthorizationContract').instance;
    ownContainer.addValue({
        id: 'IsAValidAccessKeyFunction',
        value: (key) => {
            return authorizationContract.isAValidAccessKey(key);
        },
    });
    ownContainer.add({
        id: 'IsKeyPresentMiddleware',
        kind: is_key_present_middleware_1.IsKeyPresentMiddleware,
        dependencies: ['IsAValidAccessKeyFunction', 'is-key-present-flag'],
        strategy: 'singleton',
    });
    ownContainer.addValue({
        id: 'is-authorized-user-flag',
        value: env_1.env.middlewares['is-authorized-user'],
    });
    ownContainer.add({
        id: 'IsAuthorizedUserMiddleware',
        kind: is_authorized_user_middleware_1.IsAuthorizedUserMiddleware,
        strategy: 'singleton',
        dependencies: ['is-authorized-user-flag'],
    });
    const middleware = ownContainer
        .getInstance('IsKeyPresentMiddleware')
        .instance.getValidator();
    app.use(middleware);
    tournament_controller_1.TournamentController.registerEntryPoints(app, ownContainer);
    return app;
}
exports.main = main;
