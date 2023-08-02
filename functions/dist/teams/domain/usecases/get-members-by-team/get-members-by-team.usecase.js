"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMembersByTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetMembersByTeamUsecase extends usecase_1.Usecase {
    constructor(memberContract, userContract) {
        super();
        this.memberContract = memberContract;
        this.userContract = userContract;
    }
    call(teamId) {
        return this.memberContract
            .filter({
            teamId,
        }, {
            teamId: {
                operator: '==',
                value: teamId,
            },
        })
            .pipe((0, operators_1.mergeMap)((members) => {
            console.log('Member length: ', members.length);
            const $members = members.map((member) => {
                return this.userContract.getUserInformationById(member.userId).pipe((0, operators_1.map)((user) => ({
                    member,
                    user,
                })));
            });
            return $members.length > 0 ? (0, rxjs_1.zip)(...$members) : (0, rxjs_1.of)([]);
        }), (0, operators_1.map)((data) => {
            const filtered = data.filter((x) => !!x.user);
            return filtered;
        }));
    }
}
exports.GetMembersByTeamUsecase = GetMembersByTeamUsecase;
