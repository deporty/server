"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_contract_1 = require("../../domain/contracts/user.contract");
class UserRepository extends user_contract_1.UserContract {
    constructor(dataSource, mapper) {
        super(dataSource, mapper);
        this.dataSource = dataSource;
        this.mapper = mapper;
        this.entity = UserRepository.entity;
    }
}
exports.UserRepository = UserRepository;
UserRepository.entity = 'users';
