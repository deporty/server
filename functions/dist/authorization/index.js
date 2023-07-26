"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const express = require("express");
const DI_1 = require("../core/DI");
const access_key_modules_config_1 = require("./access-key/access-key-modules.config");
const authorization_modules_config_1 = require("./authorization-modules.config");
const authorization_controller_1 = require("./authorization.controller");
const cors = require("cors");
const permissions_modules_config_1 = require("./permissions/permissions-modules.config");
const resources_modules_config_1 = require("./resources/resources-modules.config");
const roles_modules_config_1 = require("./roles/roles-modules.config");
function main(generalContainer) {
    const app = express();
    app.use(cors());
    const ownContainer = new DI_1.Container();
    ownContainer.addAll(generalContainer);
    roles_modules_config_1.RoleModulesConfig.config(ownContainer);
    permissions_modules_config_1.PermissionModulesConfig.config(ownContainer);
    resources_modules_config_1.ResourceModulesConfig.config(ownContainer);
    access_key_modules_config_1.AccessKeyModulesConfig.config(ownContainer);
    authorization_modules_config_1.AuthorizationModulesConfig.config(ownContainer);
    // const middleware = ownContainer
    //   .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
    //   .instance.getValidator();
    // app.use(middleware);
    authorization_controller_1.AuthorizationController.registerEntryPoints(app, ownContainer);
    return app;
}
exports.main = main;
