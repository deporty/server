"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTree = exports._createTree = exports._isEmpty = exports.isAvalidTree = exports.isAvalidConfiguration = exports.createTeamIdentifiers = exports.GROUP_SIZES_PLACEHOLDERS = void 0;
exports.GROUP_SIZES_PLACEHOLDERS = [];
function createTeamIdentifiers(groupConfig) {
    const response = [];
    for (let i = 0; i < groupConfig.length; i++) {
        const ammount = groupConfig[i];
        const label = exports.GROUP_SIZES_PLACEHOLDERS[i];
        const teamsIdentifiers = Array.from({ length: ammount }, (_, index) => label + (index + 1) + '');
        response.push(teamsIdentifiers);
    }
    return response;
}
exports.createTeamIdentifiers = createTeamIdentifiers;
function isAvalidConfiguration(groupConfig) {
    return groupConfig.reduce((previousValue, currentValue) => {
        return previousValue && currentValue > 0;
    }, true);
}
exports.isAvalidConfiguration = isAvalidConfiguration;
function isAvalidTree(matches) {
    return matches.reduce((previousValue, currentValue) => {
        return (previousValue &&
            currentValue.reduce((previousValue1, currentValue1) => {
                return previousValue1 && !!currentValue1;
            }, true));
    }, true);
}
exports.isAvalidTree = isAvalidTree;
function _isEmpty(teamsIdentifiers) {
    return teamsIdentifiers.reduce((previousValue, currentValue) => {
        return previousValue && currentValue.length == 0;
    }, true);
}
exports._isEmpty = _isEmpty;
function _createTree(index, teamsIdentifiers, response) {
    if (_isEmpty(teamsIdentifiers)) {
        return;
    }
    const currentGroup = teamsIdentifiers[index];
    const nextIndex = index + 1 < teamsIdentifiers.length ? index + 1 : 0;
    const nextGroup = teamsIdentifiers[nextIndex];
    const A0Index = 0;
    const B1Index = nextGroup.length - 1;
    const A0 = currentGroup.splice(A0Index, 1)[0];
    const B1 = nextGroup.splice(B1Index, 1)[0];
    const info = [A0, B1];
    response.push(info);
    _createTree(nextIndex, teamsIdentifiers, response);
}
exports._createTree = _createTree;
function createTree(groupConfig) {
    const teamsIdentifiers = createTeamIdentifiers(groupConfig);
    const isValid = isAvalidConfiguration(groupConfig);
    if (isValid) {
        const response = [];
        _createTree(0, teamsIdentifiers, response);
    }
}
exports.createTree = createTree;
