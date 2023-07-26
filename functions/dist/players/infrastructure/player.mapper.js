"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMapper = void 0;
const mapper_1 = require("../../core/mapper");
class PlayerMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            name: { name: 'name' },
            lastName: { name: 'last-name' },
            id: { name: 'id' },
            document: { name: 'document' },
            image: { name: 'image' },
            phone: { name: 'phone' },
            email: { name: 'email' },
            roles: { name: 'roles' },
            birthDate: { name: 'birth-date' },
        };
    }
}
exports.PlayerMapper = PlayerMapper;
