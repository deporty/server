"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const create_team_exceptions_1 = require("./create-team.exceptions");
class CreateTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, getTeamByNameUsecase, editTeamUsecase, fileAdapter) {
        super();
        this.teamContract = teamContract;
        this.getTeamByNameUsecase = getTeamByNameUsecase;
        this.editTeamUsecase = editTeamUsecase;
        this.fileAdapter = fileAdapter;
    }
    call(team) {
        return this.getTeamByNameUsecase.call(team.name).pipe((0, operators_1.map)((teamPrev) => {
            if (teamPrev) {
                return (0, rxjs_1.throwError)(new create_team_exceptions_1.TeamAlreadyExistsException(teamPrev.name));
            }
            else {
                const teamToSave = Object.assign({}, team);
                delete teamToSave['miniShield'];
                delete teamToSave['shield'];
                return this.teamContract.save(teamToSave).pipe((0, operators_1.map)((id) => {
                    const $shield = team.shield
                        ? (() => {
                            const extension = team.shield
                                .split(',')[0]
                                .split('/')[1]
                                .split(';')[0];
                            const path = `teams/${id}/brand/shield.${extension}`;
                            return this.fileAdapter
                                .uploadFile(path, team.shield)
                                .pipe((0, operators_1.map)((item) => path));
                        })()
                        : (0, rxjs_1.of)(undefined);
                    const $miniShield = team.miniShield
                        ? (() => {
                            const extension = team.miniShield
                                .split(',')[0]
                                .split('/')[1]
                                .split(';')[0];
                            const path = `teams/${id}/brand/mini-shield.${extension}`;
                            return this.fileAdapter
                                .uploadFile(path, team.miniShield)
                                .pipe((0, operators_1.map)((item) => path));
                        })()
                        : (0, rxjs_1.of)(undefined);
                    return (0, rxjs_1.zip)($shield, $miniShield, (0, rxjs_1.of)(id), (0, rxjs_1.of)(team));
                }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
                    const teamToEdit = Object.assign(Object.assign({}, x[3]), { id: x[2], miniShield: x[1], shield: x[0] });
                    return this.editTeamUsecase
                        .call(teamToEdit)
                        .pipe((0, operators_1.map)((x) => x.id));
                }), (0, operators_1.mergeMap)((x) => x));
            }
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.CreateTeamUsecase = CreateTeamUsecase;
