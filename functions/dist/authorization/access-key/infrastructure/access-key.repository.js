"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyRepository = void 0;
const authorization_constants_1 = require("../../infrastructure/authorization.constants");
const access_key_contract_1 = require("../domain/contracts/access-key.contract");
class AccessKeyRepository extends access_key_contract_1.AccessKeyContract {
    constructor(dataSource, accessKeyMapper) {
        super(dataSource, accessKeyMapper);
        this.dataSource = dataSource;
        this.accessKeyMapper = accessKeyMapper;
        this.entity = authorization_constants_1.ACCESS_KEY_ENTITY;
    }
}
exports.AccessKeyRepository = AccessKeyRepository;
AccessKeyRepository.entity = authorization_constants_1.ACCESS_KEY_ENTITY;
