"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BEARER_TOKEN = exports.AUTHORIZATION_SERVER = exports.SERVER = exports.GRADES_PER_KM_LONGITUDE = exports.GRADES_PER_KM_LATITUDE = exports.KM_PER_GRADE_LONGITUDE = exports.KM_PER_GRADE_LATITUDE = exports.LOCATIONS_ENTITY = void 0;
exports.LOCATIONS_ENTITY = 'locations';
exports.KM_PER_GRADE_LATITUDE = 110.5746;
exports.KM_PER_GRADE_LONGITUDE = 111.3195;
exports.GRADES_PER_KM_LATITUDE = 1 / exports.KM_PER_GRADE_LATITUDE;
exports.GRADES_PER_KM_LONGITUDE = 1 / exports.KM_PER_GRADE_LONGITUDE;
// export const SERVER = 'https://us-central1-deporty-dev.cloudfunctions.net'
exports.SERVER = 'http://127.0.0.1:5001/deporty-dev/us-central1';
exports.AUTHORIZATION_SERVER = `${exports.SERVER}/authorization`;
exports.BEARER_TOKEN = 'f599e916-841b-4a1b-aa0a-65fefcaadf09';
