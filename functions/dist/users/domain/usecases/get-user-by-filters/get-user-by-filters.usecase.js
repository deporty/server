"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersByFiltersUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetUsersByFiltersUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(params) {
        console.log('Params:::>>  ', params);
        const filters = {};
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const element = params[key];
                if (element != undefined && element != null && element != '') {
                    if (Array.isArray(element)) {
                        filters[key] = {
                            operator: 'array-contains-any',
                            value: element,
                        };
                    }
                    else {
                        filters[key] = {
                            operator: 'contains',
                            value: element,
                        };
                    }
                }
            }
        }
        console.log(56446, filters);
        return this.userContract.filter(filters);
    }
}
exports.GetUsersByFiltersUsecase = GetUsersByFiltersUsecase;
