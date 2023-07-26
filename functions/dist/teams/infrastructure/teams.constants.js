"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.BEARER_TOKEN = exports.AUTHORIZATION_SERVER = exports.USERS_SERVER = exports.SERVER = exports.SPORTS_ENTITY = exports.MEMBERS_ENTITY = exports.TEAMS_ENTITY = void 0;
exports.TEAMS_ENTITY = 'teams';
exports.MEMBERS_ENTITY = 'members';
exports.SPORTS_ENTITY = 'sports';
// export const SERVER = 'https://us-central1-deporty-dev.cloudfunctions.net'
exports.SERVER = 'http://localhost:5001/deporty-dev/us-central1';
exports.USERS_SERVER = `${exports.SERVER}/users`;
exports.AUTHORIZATION_SERVER = `${exports.SERVER}/authorization`;
exports.BEARER_TOKEN = 'f599e916-841b-4a1b-aa0a-65fefcaadf09';
exports.JWT_SECRET = '3339cb48-abd0-41f7-8f2a-c04ab15d115d';
