"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportMapper = void 0;
const mapper_1 = require("../../core/mapper");
class SportMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            sportsFamilyId: { name: 'sports-family-id' },
            name: { name: 'name' },
            id: { name: 'id' },
        };
    }
}
exports.SportMapper = SportMapper;
