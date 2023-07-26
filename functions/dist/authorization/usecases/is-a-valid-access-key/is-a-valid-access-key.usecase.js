"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAValidAccessKeyUsecase = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../core/usecase");
const operators_1 = require("rxjs/operators");
const moment = require("moment");
class IsAValidAccessKeyUsecase extends usecase_1.Usecase {
    constructor(accessKeyContract) {
        super();
        this.accessKeyContract = accessKeyContract;
    }
    call(key) {
        if (!key) {
            return (0, rxjs_1.of)(false);
        }
        return this.accessKeyContract
            .filter({
            key: {
                operator: '=',
                value: key,
            },
        })
            .pipe((0, operators_1.map)((accessKey) => {
            if (accessKey.length != 1) {
                return false;
            }
            const now = moment(new Date());
            const accessKeyDate = moment(accessKey[0].expirationDate);
            return accessKeyDate.isAfter(now);
        }));
    }
}
exports.IsAValidAccessKeyUsecase = IsAValidAccessKeyUsecase;
