"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralContract = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const filter_query_manager_1 = require("./filter-query-manager");
const helpers_1 = require("./helpers");
class GeneralContract {
    constructor(datasource, mapper) {
        this.datasource = datasource;
        this.mapper = mapper;
    }
    innerSave(accessParams, entity) {
        const route = this.getRouteToColl(this.datasource, accessParams);
        return (0, rxjs_1.from)(route.add(this.mapper.toJson(entity))).pipe((0, operators_1.map)((snapshot) => {
            return snapshot.id;
        }));
    }
    innerUpdate(accessParams, entity) {
        return new rxjs_1.Observable((observer) => {
            const docReference = this.getRouteToDoc(this.datasource, accessParams);
            if (docReference) {
                docReference.update(this.mapper.toJson(entity)).then(() => {
                    observer.next();
                    observer.complete();
                });
            }
            else {
                observer.next();
                observer.complete();
            }
        });
    }
    innerDelete(accessParams) {
        const route = this.getRouteToDoc(this.datasource, accessParams);
        if (!route) {
            return (0, rxjs_1.of)();
        }
        return (0, rxjs_1.from)(route.delete()).pipe((0, operators_1.map)((item) => {
            return;
        }));
    }
    innerFilter(accessParams, config) {
        const route = this.getRouteToColl(this.datasource, accessParams);
        let query = route;
        const filters = config === null || config === void 0 ? void 0 : config.filters;
        const pagination = config === null || config === void 0 ? void 0 : config.pagination;
        if (!!pagination) {
            if (pagination.pageNumber != 0) {
                query = query
                    .orderBy('id')
                    .limit((pagination.pageNumber + 1) * pagination.pageSize);
                return (0, rxjs_1.from)(query.get())
                    .pipe((0, operators_1.map)((items) => {
                    return items.docs
                        .map((item) => (Object.assign(Object.assign({}, item.data()), { id: item.id })))
                        .pop();
                }), (0, operators_1.map)((last) => {
                    if (last) {
                        query = query
                            .startAfter(last.id)
                            .limit(pagination.pageSize);
                    }
                    return query;
                }), (0, operators_1.mergeMap)((query) => {
                    return (0, rxjs_1.from)(query.get()).pipe((0, operators_1.map)((items) => {
                        return items.docs.map((item) => (Object.assign(Object.assign({}, item.data()), { id: item.id })));
                    }));
                }))
                    .pipe(this.mapItems());
            }
            else {
                query = query.limit(pagination.pageSize);
                return (0, rxjs_1.from)(query.get()).pipe((0, operators_1.map)((items) => {
                    return items.docs.map((item) => (Object.assign(Object.assign({}, item.data()), { id: item.id })));
                }));
            }
        }
        const computedFilters = (0, filter_query_manager_1.filterWizard)(query, filters, this.mapper);
        query = computedFilters.query;
        let $query = (0, rxjs_1.from)(query.get()).pipe((0, operators_1.map)((items) => {
            return items.docs.map((item) => (Object.assign(Object.assign({}, item.data()), { id: item.id })));
        }));
        for (const pipe of computedFilters.pipe) {
            $query = $query.pipe(pipe);
        }
        return $query.pipe(this.mapItems());
    }
    innerGet(accessParams, pagination) {
        return this.innerFilter(accessParams, {
            pagination,
        });
    }
    innerGetById(accessParams) {
        const route = this.getRouteToDoc(this.datasource, accessParams);
        if (!route) {
            return (0, rxjs_1.of)(undefined);
        }
        return (0, rxjs_1.from)(route.get()).pipe((0, operators_1.map)(helpers_1.unifyData), (0, operators_1.mergeMap)((member) => {
            if (member) {
                return this.mapper.fromJson(member);
            }
            else {
                return (0, rxjs_1.of)(member);
            }
        }));
    }
    getRouteToColl(db, params) {
        let query = db;
        for (let i = 0; i < params.length - 1; i++) {
            const param = params[i];
            query = query.collection(param.collection).doc(param.id);
        }
        query = query.collection(params[params.length - 1].collection);
        return query;
    }
    getRouteToDoc(db, params) {
        if (Object.keys(params).length === 0) {
            return null;
        }
        let query = db;
        for (const item of params) {
            const collection = item.collection;
            const id = item.id;
            query = query.collection(collection).doc(id);
        }
        return query;
    }
    mapItems() {
        return (0, operators_1.mergeMap)((items) => {
            return items.length > 0
                ? (0, rxjs_1.zip)(...items.map((item) => {
                    return this.mapper
                        .fromJson(item)
                        .pipe((0, operators_1.filter)((item) => !!item));
                })).pipe((0, operators_1.map)((items) => {
                    return items;
                }))
                : (0, rxjs_1.of)([]);
        });
    }
}
exports.GeneralContract = GeneralContract;
