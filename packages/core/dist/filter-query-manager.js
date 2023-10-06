"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterWizard = exports.CustomFilterOperators = void 0;
const infrastructure_1 = require("@scifamek-open-source/iraca/infrastructure");
const firestore_1 = require("firebase-admin/firestore");
exports.CustomFilterOperators = ['=', 'contains'];
function filterWizard(filters, mapper) {
    const response = {
        query: [],
        pipe: [],
    };
    if (filters) {
        const castedFilters = filters;
        if (castedFilters.and || castedFilters.or) {
            if (castedFilters.and) {
                const andResponse = generateBaseFilters(castedFilters.and, firestore_1.Filter.and, mapper);
                response.pipe.push(...andResponse.pipe);
                if (andResponse.query) {
                    response.query.push(andResponse.query);
                }
            }
            if (castedFilters.or) {
                const orResponse = generateBaseFilters(castedFilters.or, firestore_1.Filter.or, mapper);
                response.pipe.push(...orResponse.pipe);
                if (orResponse.query) {
                    response.query.push(orResponse.query);
                }
            }
            if (response.query.length == 1) {
                return {
                    pipe: response.pipe,
                    query: response.query[0],
                };
            }
            else if (response.query.length > 1) {
                return {
                    pipe: response.pipe,
                    query: firestore_1.Filter.and(...response.query),
                };
            }
            return {
                pipe: response.pipe,
                query: null,
            };
        }
        else {
            return generateBaseFilters(filters, firestore_1.Filter.and, mapper);
        }
    }
    return {
        pipe: [],
        query: null,
    };
}
exports.filterWizard = filterWizard;
function generateBaseFilters(filters, logicOperator, mapper) {
    const customOperators = [];
    let q = [];
    for (const key in filters) {
        const config = filters[key];
        if (Array.isArray(config)) {
            let r = [];
            for (const innerConfig of config) {
                let x = map(key, innerConfig, customOperators, mapper);
                if (x) {
                    r.push(x);
                }
            }
            q.push(firestore_1.Filter.and(r));
        }
        else {
            let y = map(key, config, customOperators, mapper);
            if (y) {
                q.push(y);
            }
        }
    }
    const response = {
        query: logicOperator(...q),
        pipe: customOperators,
    };
    return response;
}
function map(key, config, customOperators, mapper) {
    let transformKey = key;
    if (!!mapper) {
        if (!mapper.attributesMapper[key]) {
        }
        else {
            transformKey = mapper.attributesMapper[key].name;
        }
    }
    if (exports.CustomFilterOperators.indexOf(config.operator) == -1) {
        return firestore_1.Filter.where(transformKey, config.operator, config.value);
    }
    else {
        const handler = infrastructure_1.OPERATORS_HANDLER_MAPPER[config.operator];
        if (handler) {
            customOperators.push(handler(transformKey, config.value));
        }
    }
    return null;
}
