"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapper = void 0;
const firestore_1 = require("firebase-admin/firestore");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("./helpers");
class Mapper {
    constructor() {
        this.attributesMapper = {};
    }
    fromJson(obj) {
        const values = Object.values(this.attributesMapper);
        const keys = Object.keys(this.attributesMapper);
        const newKeys = [];
        if (!obj) {
            return (0, rxjs_1.of)(undefined);
        }
        for (let index = 0; index < values.length; index++) {
            const config = values[index];
            const value = config.name;
            const key = keys[index];
            let mappedValue = undefined;
            if (config.from) {
                if (obj[value] !== undefined) {
                    mappedValue = config.from(obj[value]).pipe((0, operators_1.map)((val) => {
                        return {
                            key,
                            value: val,
                        };
                    }));
                }
                else if (config.default != undefined) {
                    mappedValue = (0, rxjs_1.of)(config.default).pipe((0, operators_1.map)((val) => {
                        return {
                            key,
                            value: val,
                        };
                    }));
                }
                else {
                    mappedValue = undefined;
                }
            }
            else {
                if (obj[value] !== undefined) {
                    mappedValue = (0, rxjs_1.of)({
                        key,
                        value: obj[value],
                    });
                }
                else if (config.default !== undefined) {
                    mappedValue = (0, rxjs_1.of)({
                        key,
                        value: config.default,
                    });
                }
                else {
                    mappedValue = undefined;
                }
            }
            if (mappedValue) {
                newKeys.push(mappedValue);
            }
        }
        return newKeys.length > 0
            ? (0, rxjs_1.zip)(...newKeys).pipe((0, operators_1.map)((mappedAttributes) => {
                const result = {};
                for (const mappedAttribute of mappedAttributes) {
                    result[mappedAttribute.key] = mappedAttribute.value;
                }
                return result;
            }))
            : (0, rxjs_1.of)({});
    }
    //REVIEW
    fromReference(obj) {
        return (0, rxjs_1.from)(obj.get()).pipe((0, operators_1.map)((ob) => {
            return Object.assign(Object.assign({}, ob.data()), { id: ob.id });
        }), (0, operators_1.map)((x) => this.mapInsideReferences(x)), (0, operators_1.mergeMap)((x) => x));
    }
    mapInsideReferences(jsonData, p = false) {
        const entries = Object.entries(jsonData);
        const newObj = Object.assign({}, jsonData);
        const populatedAttributes = [];
        for (const entry of entries) {
            if (entry[1] instanceof firestore_1.DocumentReference) {
                this.mapDocumentReferences(populatedAttributes, entry);
            }
            else if (entry[1] instanceof firestore_1.Timestamp) {
                this.mapDateReferences(newObj, entry);
            }
            else if (Array.isArray(entry[1])) {
                this.mapArrayReferences(entry, populatedAttributes);
            }
            else if (typeof entry[1] === 'number' ||
                typeof entry[1] === 'string' ||
                typeof entry[1] === 'boolean') {
                this.mapPrimitiveReferences(populatedAttributes, entry);
            }
            else if (entry[1] instanceof Object) {
                this.mapObjectReferences(populatedAttributes, entry);
            }
        }
        const $populatedAttributes = populatedAttributes.length > 0 ? (0, rxjs_1.zip)(...populatedAttributes) : (0, rxjs_1.of)([]);
        const $obj = (0, rxjs_1.of)(newObj);
        return (0, rxjs_1.zip)($obj, $populatedAttributes).pipe((0, operators_1.map)((data) => {
            const originalObj = data[0];
            const modifiedAttributes = data[1];
            for (const attr of modifiedAttributes) {
                originalObj[attr['attribute']] = attr['value'];
            }
            return originalObj;
        }));
    }
    toJson(obj) {
        const values = Object.values(this.attributesMapper);
        const keys = Object.keys(this.attributesMapper);
        const result = {};
        for (let index = 0; index < values.length; index++) {
            const config = values[index];
            const value = values[index].name;
            const key = keys[index];
            let mappedValue = obj[key] === undefined ? config.default : obj[key];
            if (config.to && mappedValue !== undefined) {
                mappedValue = config.to(obj[key]);
            }
            if (mappedValue !== undefined) {
                result[value] = mappedValue;
            }
        }
        return result;
    }
    mapArrayReferences(entry, populatedAttributes) {
        const arrayProperties = [];
        for (const element of entry[1]) {
            if (element instanceof firestore_1.DocumentReference) {
                arrayProperties.push(this.fromReference(element));
            }
            else if (entry[1] instanceof firestore_1.Timestamp) {
                arrayProperties.push((0, rxjs_1.of)((0, helpers_1.getDateFromSeconds)(element)));
            }
            else if (typeof element === 'number' ||
                typeof element === 'string' ||
                typeof element === 'boolean') {
                arrayProperties.push((0, rxjs_1.of)(element));
            }
            else if (element instanceof Object) {
                const tempRes = this.mapInsideReferences(element);
                arrayProperties.push(tempRes);
            }
        }
        const temp = arrayProperties.length > 0 ? (0, rxjs_1.zip)(...arrayProperties) : (0, rxjs_1.of)([]);
        populatedAttributes.push(temp.pipe((0, operators_1.map)((value) => {
            return {
                attribute: entry[0],
                value,
            };
        })));
    }
    mapDateReferences(newObj, entry) {
        newObj[entry[0]] = (0, helpers_1.getDateFromSeconds)(entry[1]);
    }
    mapDocumentReferences(populatedAttributes, entry) {
        populatedAttributes.push(this.fromReference(entry[1]).pipe((0, operators_1.map)((value) => {
            return {
                attribute: entry[0],
                value,
            };
        })));
    }
    mapObjectReferences(populatedAttributes, entry) {
        populatedAttributes.push(this.mapInsideReferences(entry[1]).pipe((0, operators_1.map)((value) => {
            return {
                attribute: entry[0],
                value,
            };
        })));
    }
    mapPrimitiveReferences(populatedAttributes, entry) {
        populatedAttributes.push((0, rxjs_1.of)(entry[1]).pipe((0, operators_1.map)((value) => {
            return {
                attribute: entry[0],
                value,
            };
        })));
    }
}
exports.Mapper = Mapper;
