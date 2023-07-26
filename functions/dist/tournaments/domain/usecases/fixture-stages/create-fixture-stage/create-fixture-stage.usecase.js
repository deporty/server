"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFixtureStageUsecase = exports.FixtureStageAlreadyExistsError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class FixtureStageAlreadyExistsError extends Error {
    constructor(properties) {
        super();
        this.name = 'FixtureStageAlreadyExistsError';
        this.message = `The fixture stage already exists: ${properties.join(', ')} `;
    }
}
exports.FixtureStageAlreadyExistsError = FixtureStageAlreadyExistsError;
class CreateFixtureStageUsecase extends usecase_1.Usecase {
    constructor(fixtureStageContract) {
        super();
        this.fixtureStageContract = fixtureStageContract;
    }
    call(fixtureStage) {
        return this.fixtureStageContract
            .filter({
            tournamentId: fixtureStage.tournamentId,
        }, {
            order: {
                operator: '==',
                value: fixtureStage.order,
            },
            tournamentId: {
                operator: '==',
                value: fixtureStage.tournamentId,
            },
        })
            .pipe((0, operators_1.mergeMap)((prevFixtureStages) => {
            if (prevFixtureStages.length > 0) {
                return (0, rxjs_1.throwError)(new FixtureStageAlreadyExistsError(prevFixtureStages.map((x) => x.order)));
            }
            return this.fixtureStageContract
                .save({
                tournamentId: fixtureStage.tournamentId,
            }, fixtureStage)
                .pipe((0, operators_1.map)((fixtureStageId) => {
                return Object.assign(Object.assign({}, fixtureStage), { id: fixtureStageId });
            }));
        }));
    }
}
exports.CreateFixtureStageUsecase = CreateFixtureStageUsecase;
