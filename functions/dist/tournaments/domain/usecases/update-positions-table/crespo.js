"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quicksort = exports.orderRecursively = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const tie_breaking_handlers_1 = require("./tie-breaking-handlers");
function orderRecursively(a, b, order, index, param, getAnyMatchByTeamIdsUsecase, setLength) {
    if (index == order.length) {
        const randomNumber = Math.random();
        if (randomNumber > 0.5) {
            return (0, rxjs_1.of)(-1);
        }
        else {
            return (0, rxjs_1.of)(1);
        }
    }
    const currentOrder = order[index];
    if (tie_breaking_handlers_1.BASIC_TIE_BREAKING_ORDER_MAP[currentOrder]) {
        const config = tie_breaking_handlers_1.BASIC_TIE_BREAKING_ORDER_MAP[currentOrder];
        const property = config.property;
        const operator = config.operator;
        const result = operator(a.stadistics[property], b.stadistics[property]);
        result.pipe((0, operators_1.mergeMap)((resultNumber) => {
            if (resultNumber === 0) {
                return orderRecursively(a, b, order, index + 1, param, getAnyMatchByTeamIdsUsecase, setLength);
            }
            else {
                return (0, rxjs_1.of)(resultNumber);
            }
        }));
        return result;
    }
    else {
        const config = tie_breaking_handlers_1.ADVANCED_TIE_BREAKING_ORDER_MAP[currentOrder];
        const operator = config.operator;
        let result;
        if (currentOrder == 'WB2') {
            if (setLength != 2) {
                result = (0, rxjs_1.of)(0);
            }
            else {
                result = operator(getAnyMatchByTeamIdsUsecase, a.teamId, b.teamId, param.meta);
            }
        }
        else {
            result = operator();
        }
        result.pipe((0, operators_1.mergeMap)((resultNumber) => {
            if (resultNumber == 0) {
                return orderRecursively(a, b, order, index + 1, param, getAnyMatchByTeamIdsUsecase, setLength);
            }
            else {
                return (0, rxjs_1.of)(resultNumber);
            }
        }));
        return result;
    }
}
exports.orderRecursively = orderRecursively;
function quicksort(collection, tieBreakingOrder, setLength, param, getAnyMatchByTeamIdsUsecase) {
    if (collection.length <= 1) {
        return (0, rxjs_1.of)(collection); // Ya está ordenado (caso base)
    }
    const pivot = collection[0]; // Tomamos el primer elemento como pivote
    // Separamos los elementos en los arreglos left y right
    const consolidated = [];
    for (let i = 1; i < collection.length; i++) {
        const result = orderRecursively(collection[i], pivot, tieBreakingOrder, 0, param, getAnyMatchByTeamIdsUsecase, setLength);
        const res = (0, rxjs_1.zip)(result, (0, rxjs_1.of)(collection[i]));
        consolidated.push(res);
    }
    return (0, rxjs_1.zip)(...consolidated).pipe((0, operators_1.mergeMap)((result) => {
        const left = [];
        const right = [];
        for (const r of result) {
            if (r[0] < 0) {
                left.push(r[1]);
            }
            else {
                right.push(r[1]);
            }
        }
        const $sortedLeft = quicksort(left, tieBreakingOrder, setLength, param, getAnyMatchByTeamIdsUsecase);
        const $sortedRight = quicksort(right, tieBreakingOrder, setLength, param, getAnyMatchByTeamIdsUsecase);
        return (0, rxjs_1.zip)($sortedLeft, (0, rxjs_1.of)(pivot), $sortedRight).pipe((0, operators_1.map)(([sortedLeft, pivot, sortedRight]) => {
            return [...sortedLeft, pivot, ...sortedRight];
        }));
    }));
    // Llamadas recursivas para ordenar los subarreglos
    // Combinamos los arreglos ordenados junto con el pivote en el medio
}
exports.quicksort = quicksort;
