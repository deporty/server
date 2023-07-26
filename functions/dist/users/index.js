"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors = require("cors");
const express = require("express");
const DI_1 = require("../core/DI");
const user_controller_1 = require("./infrastructure/user.controller");
const users_modules_config_1 = require("./users-modules.config");
const env_1 = require("./environments/env");
const is_key_present_middleware_1 = require("../core/middlewares/is-key-present.middleware");
function main(generalContainer) {
    const app = express();
    app.use(cors());
    const ownContainer = new DI_1.Container();
    ownContainer.addAll(generalContainer);
    users_modules_config_1.UserModulesConfig.config(ownContainer);
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
    const middleware = ownContainer
        .getInstance('IsKeyPresentMiddleware')
        .instance.getValidator();
    app.use(middleware);
    user_controller_1.UserController.registerEntryPoints(app, ownContainer);
    return app;
}
exports.main = main;
