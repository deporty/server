"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateFromJson = void 0;
const firestore_1 = require("firebase-admin/firestore");
function formatDateFromJson(date, defaultValue = undefined) {
    if (typeof date === 'string') {
        if (date != '') {
            return new Date(date);
        }
    }
    else if (date instanceof firestore_1.Timestamp) {
        if (Object.keys(date).length != 0) {
            return date.toDate();
        }
    }
    return defaultValue;
}
exports.formatDateFromJson = formatDateFromJson;
