"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.BEARER_TOKEN = exports.AUTHORIZATION_SERVER = exports.ORGANIZATION_SERVER = exports.TEAM_SERVER = exports.LOCATION_SERVER = exports.SERVER = exports.MATCHS_ENTITY = exports.GROUPS_ENTITY = exports.MAIN_DRAW_ENTITY = exports.INTERGROUP_MATCHES_ENTITY = exports.FIXTURE_STAGES_ENTITY = exports.REGISTERED_TEAMS_ENTITY = exports.TOURNAMENTS_ENTITY = void 0;
exports.TOURNAMENTS_ENTITY = 'tournaments';
exports.REGISTERED_TEAMS_ENTITY = 'registered-teams';
exports.FIXTURE_STAGES_ENTITY = 'fixture-stages';
exports.INTERGROUP_MATCHES_ENTITY = 'intergroup-matches';
exports.MAIN_DRAW_ENTITY = 'main-draw';
exports.GROUPS_ENTITY = 'groups';
exports.MATCHS_ENTITY = 'matches';
// export const SERVER = 'https://us-central1-deporty-dev.cloudfunctions.net'
exports.SERVER = 'http://localhost:5001/deporty-dev/us-central1';
exports.LOCATION_SERVER = `${exports.SERVER}/locations`;
exports.TEAM_SERVER = `${exports.SERVER}/teams`;
exports.ORGANIZATION_SERVER = `${exports.SERVER}/organizations`;
exports.AUTHORIZATION_SERVER = `${exports.SERVER}/authorization`;
exports.BEARER_TOKEN = 'f599e916-841b-4a1b-aa0a-65fefcaadf09';
exports.JWT_SECRET = '3339cb48-abd0-41f7-8f2a-c04ab15d115d';
