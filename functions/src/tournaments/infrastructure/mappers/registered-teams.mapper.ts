import { RegisteredTeamEntity } from "@deporty-org/entities/tournaments";
import { Timestamp } from "firebase-admin/firestore";
import { of, zip } from "rxjs";
import { Mapper } from "../../../core/mapper";
import { MemberEntity } from "@deporty-org/entities";
import { MemberMapper } from "./member.mapper";

export class RegisteredTeamMapper extends Mapper<RegisteredTeamEntity> {
  constructor(private memberMapper: MemberMapper) {
    super();
    this.attributesMapper = {
      tournamentId: { name: "tournament-id" },
      id: { name: "id" },

      enrollmentDate: {
        name: "enrollment-date",
        from: (date: Timestamp) => {
          
          return date ? of(date.toDate()) : of(undefined);
        },
      },
      members: {
        name: "members",

        from: (members: Array<any>) => {
          return members.length > 0
            ? zip(
                ...members.map((element) => {
                  return this.memberMapper.fromJson(element);
                })
              )
            : of([]);
        },
        to: (members: Array<MemberEntity>) => {
          return members.length > 0
            ? members.map((element) => {
                return this.memberMapper.toJson(element);
              })
            : [];
        },
      },

      teamId: { name: "team-id" },
      status: { name: "status" },
    };
  }
}
