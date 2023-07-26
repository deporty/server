"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors = require("cors");
const express = require("express");
const invoices_controller_1 = require("./infrastructure/invoices.controller");
const invoices_modules_config_1 = require("./invoices-modules.config");
function main(container) {
    const app = express();
    app.use(cors());
    invoices_modules_config_1.InvoicesModulesConfig.config(container);
    invoices_controller_1.InvoicesController.registerEntryPoints(app, container);
    const middleware = container
        .getInstance('IsKeyPresentMiddleware')
        .instance.getValidator();
    app.use(middleware);
    return { app, controller: invoices_controller_1.InvoicesController.registerEntryPoints };
}
exports.main = main;
