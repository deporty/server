"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersByIdsUsecase = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../../core/usecase");
class GetUsersByIdsUsecase extends usecase_1.Usecase {
    constructor(getUserByIdUsecase) {
        super();
        this.getUserByIdUsecase = getUserByIdUsecase;
    }
    call(ids) {
        if (ids.length == 0) {
            return (0, rxjs_1.of)([]);
        }
        const $ids = ids.map((id) => {
            return this.getUserByIdUsecase.call(id);
        });
        return (0, rxjs_1.zip)(...$ids);
    }
}
exports.GetUsersByIdsUsecase = GetUsersByIdsUsecase;
