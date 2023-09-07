"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterWizard = exports.CustomFilterOperators = void 0;
const infrastructure_1 = require("@scifamek-open-source/iraca/infrastructure");
exports.CustomFilterOperators = ['=', 'contains'];
function filterWizard(query, filters, mapper) {
    const customOperators = [];
    if (filters)
        for (const key in filters) {
            const config = filters[key];
            if (Array.isArray(config)) {
                for (const innerConfig of config) {
                    query = _map(key, innerConfig, query);
                }
            }
            else {
                query = _map(key, config, query);
            }
        }
    const response = {
        query,
        pipe: customOperators,
    };
    return response;
    function _map(key, config, query) {
        let transformKey = key;
        if (!!mapper) {
            if (!mapper.attributesMapper[key]) {
            }
            else {
                transformKey = mapper.attributesMapper[key].name;
            }
        }
        if (exports.CustomFilterOperators.indexOf(config.operator) == -1) {
            query = query.where(transformKey, config.operator, config.value);
            return query;
        }
        else {
            const handler = infrastructure_1.OPERATORS_HANDLER_MAPPER[config.operator];
            if (handler) {
                customOperators.push(handler(transformKey, config.value));
            }
        }
        return query;
    }
}
exports.filterWizard = filterWizard;
