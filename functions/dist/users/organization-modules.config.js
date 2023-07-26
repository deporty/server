"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModulesConfig = void 0;
const organization_mapper_1 = require("./infrastructure/organization.mapper");
class OrganizationModulesConfig {
    static config(container) {
        container.add({
            id: 'OrganizationMapper',
            kind: organization_mapper_1.OrganizationMapper,
            dependencies: ['Firestore'],
            strategy: 'singleton',
        });
    }
}
exports.OrganizationModulesConfig = OrganizationModulesConfig;
