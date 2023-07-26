"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFixtureStageUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class DeleteFixtureStageUsecase extends usecase_1.Usecase {
    constructor(fixtureStageContract, getGroupsByFixtureStageUsecase, deleteGroupByIdUsecase) {
        super();
        this.fixtureStageContract = fixtureStageContract;
        this.getGroupsByFixtureStageUsecase = getGroupsByFixtureStageUsecase;
        this.deleteGroupByIdUsecase = deleteGroupByIdUsecase;
    }
    call(params) {
        return this.getGroupsByFixtureStageUsecase
            .call({
            fixtureStageId: params.fixtureStageId,
            tournamentId: params.tournamentId,
        })
            .pipe((0, operators_1.mergeMap)((groups) => {
            return groups.length == 0
                ? (0, rxjs_1.of)(void 0)
                : (0, rxjs_1.zip)(...groups.map((group) => this.deleteGroupByIdUsecase.call({
                    fixtureStageId: params.fixtureStageId,
                    tournamentId: params.tournamentId,
                    groupId: group.id,
                })));
        }), (0, operators_1.mergeMap)(() => {
            return this.fixtureStageContract
                .delete({
                tournamentId: params.tournamentId,
            }, params.fixtureStageId)
                .pipe((0, operators_1.map)((data) => {
                return params.fixtureStageId;
            }));
        }));
    }
}
exports.DeleteFixtureStageUsecase = DeleteFixtureStageUsecase;
