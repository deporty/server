"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors = require("cors");
const express = require("express");
const role_controller_1 = require("./infrastructure/role.controller");
const roles_modules_config_1 = require("./roles-modules.config");
function main(container) {
    const app = express();
    app.use(cors());
    roles_modules_config_1.RoleModulesConfig.config(container);
    role_controller_1.RoleController.registerEntryPoints(app, container);
    return { app, controller: role_controller_1.RoleController.registerEntryPoints };
}
exports.main = main;
