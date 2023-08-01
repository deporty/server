"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMemberByIdUsecase = exports.MemberDoesNotExistException = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class MemberDoesNotExistException extends Error {
    constructor() {
        super();
        this.message = `The member does not exists.`;
        this.name = "MemberDoesNotExistException";
    }
}
exports.MemberDoesNotExistException = MemberDoesNotExistException;
class GetMemberByIdUsecase extends usecase_1.Usecase {
    constructor(memberContract, userContract) {
        super();
        this.memberContract = memberContract;
        this.userContract = userContract;
    }
    call(param) {
        const { teamId, memberId } = param;
        return this.memberContract
            .getById({
            teamId,
        }, memberId)
            .pipe((0, operators_1.mergeMap)((member) => {
            if (!member) {
                return (0, rxjs_1.throwError)(new MemberDoesNotExistException());
            }
            return (0, rxjs_1.of)(member);
        }), (0, operators_1.mergeMap)((member) => {
            return this.userContract.getUserInformationById(member.userId).pipe((0, operators_1.map)((user) => ({
                member,
                user,
            })));
        }));
    }
}
exports.GetMemberByIdUsecase = GetMemberByIdUsecase;
