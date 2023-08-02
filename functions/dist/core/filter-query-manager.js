"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterWizard = exports.containsOperator = exports.permissiveEqualOperator = void 0;
const rxjs_1 = require("rxjs");
const helpers_1 = require("./helpers");
const operatorsHandlerMapper = {
    '=': permissiveEqualOperator,
    contains: containsOperator,
};
function permissiveEqualOperator(key, value) {
    return (source) => {
        return new rxjs_1.Observable((suscriber) => {
            source.subscribe({
                next: (items) => {
                    suscriber.next(items.filter((item) => {
                        return item[key].toUpperCase() === value.toUpperCase();
                    }));
                },
                error: () => suscriber.error(),
                complete: () => suscriber.complete(),
            });
        });
    };
}
exports.permissiveEqualOperator = permissiveEqualOperator;
function containsOperator(key, value) {
    return (source) => {
        return new rxjs_1.Observable((suscriber) => {
            source.subscribe({
                next: (items) => {
                    suscriber.next(items.filter((item) => {
                        return item[key].toUpperCase().includes(value.toUpperCase());
                    }));
                },
                error: () => suscriber.error(),
                complete: () => suscriber.complete(),
            });
        });
    };
}
exports.containsOperator = containsOperator;
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
                console.log('Propiedad no mapeada: ', key);
            }
            else {
                transformKey = mapper.attributesMapper[key].name;
            }
        }
        if (helpers_1.CustomFilterOperators.indexOf(config.operator) == -1) {
            query = query.where(transformKey, config.operator, config.value);
            return query;
        }
        else {
            const handler = operatorsHandlerMapper[config.operator];
            if (handler) {
                customOperators.push(handler(transformKey, config.value));
            }
        }
        return query;
    }
}
exports.filterWizard = filterWizard;
