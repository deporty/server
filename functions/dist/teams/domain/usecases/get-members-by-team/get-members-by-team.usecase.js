"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMembersByTeamUsecase = void 0;
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
            const userIds = members.map((member) => {
                return member.userId;
            });
            return this.userContract.getUsersByIds(userIds).pipe((0, operators_1.map)((users) => {
                const response = [];
                for (const user of users) {
                    const member = members.find((member) => member.userId === user.id);
                    if (member) {
                        response.push({
                            member,
                            user,
                        });
                    }
                }
                return response;
            }));
        })
        // map(
        //   (
        //     data: Array<{
        //       member: MemberEntity;
        //       user: UserEntity | undefined;
        //     }>
        //   ) => {
        //     const filtered = data.filter((x) => !!x.user);
        //     return filtered as Array<MemberDescriptionType>;
        //   }
        // )
        );
    }
}
exports.GetMembersByTeamUsecase = GetMembersByTeamUsecase;
