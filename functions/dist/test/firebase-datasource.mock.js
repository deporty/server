"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseDatabaseMock = void 0;
const firestore_1 = require("firebase-admin/firestore");
class FirebaseDatabaseMock extends firestore_1.Firestore {
}
exports.FirebaseDatabaseMock = FirebaseDatabaseMock;
