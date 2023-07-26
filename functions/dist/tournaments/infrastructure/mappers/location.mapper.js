"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class LocationMapper extends mapper_1.Mapper {
    constructor(playgroundMapper) {
        super();
        this.playgroundMapper = playgroundMapper;
    }
    fromJsonOverview(obj) {
        throw new Error('Method not implemented.');
    }
    fromJsonWithOutId(obj) {
        throw new Error('Method not implemented.');
    }
    toReferenceJson(obj) {
        throw new Error('Method not implemented.');
    }
    fromReferenceJson(obj) {
        throw new Error('Method not implemented.');
    }
    fromJson(obj) {
        return {
            id: obj['id'],
            name: obj['name'],
            playgrounds: obj['playgrounds']
                ? obj['playgrounds'].map((x) => this.playgroundMapper.fromJson(x))
                : [],
        };
    }
    toJson(location) {
        return {
            name: location.name,
            playgrounds: !!location.playgrounds
                ? location.playgrounds.map((x) => this.playgroundMapper.toJson(x))
                : [],
        };
    }
}
exports.LocationMapper = LocationMapper;
