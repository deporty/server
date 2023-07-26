"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors = require("cors");
const express = require("express");
const DI_1 = require("../core/DI");
const invoices_controller_1 = require("./infrastructure/invoices.controller");
const invoices_modules_config_1 = require("./invoices-modules.config");
function main(generalContainer) {
    const app = express();
    app.use(cors());
    const ownContainer = new DI_1.Container();
    ownContainer.addAll(generalContainer);
    invoices_modules_config_1.InvoicesModulesConfig.config(ownContainer);
    // const middleware = ownContainer
    //   .getInstance<IsKeyPresentMiddleware>('IsKeyPresentMiddleware')
    //   .instance.getValidator();
    // app.use(middleware);
    invoices_controller_1.InvoicesController.registerEntryPoints(app, ownContainer);
    return { app, controller: invoices_controller_1.InvoicesController.registerEntryPoints };
}
exports.main = main;
