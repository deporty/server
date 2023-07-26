"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceRepository = void 0;
const resource_contract_1 = require("../domain/resource.contract");
const resource_constants_1 = require("./resource.constants");
class ResourceRepository extends resource_contract_1.ResourceContract {
    constructor(dataSource, resourceMapper) {
        super(dataSource, resourceMapper);
        this.dataSource = dataSource;
        this.resourceMapper = resourceMapper;
        this.entity = ResourceRepository.entity;
    }
}
exports.ResourceRepository = ResourceRepository;
ResourceRepository.entity = resource_constants_1.RESOURCES_ENTITY;
