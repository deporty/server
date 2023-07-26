"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyRepository = exports.AccessKeyContract = void 0;
const transversal_contract_1 = require("../../../core/transversal-contract");
const authorization_constants_1 = require("../../authorization.constants");
class AccessKeyContract extends transversal_contract_1.TransversalContract {
}
exports.AccessKeyContract = AccessKeyContract;
class AccessKeyRepository extends AccessKeyContract {
    constructor(dataSource, accessKeyMapper) {
        super(dataSource, accessKeyMapper);
        this.dataSource = dataSource;
        this.accessKeyMapper = accessKeyMapper;
        this.entity = authorization_constants_1.ACCESS_KEY_ENTITY;
    }
}
exports.AccessKeyRepository = AccessKeyRepository;
AccessKeyRepository.entity = authorization_constants_1.ACCESS_KEY_ENTITY;
