import { MemberEntity } from "@deporty-org/entities/teams";
import { Timestamp } from "firebase-admin/firestore";
import { of } from "rxjs";
import { Mapper } from "../../core/mapper";

export class MemberMapper extends Mapper<MemberEntity> {
  constructor() {
    super();
    this.attributesMapper = {
      position: { name: "position", default: "" },
      initDate: {
        name: "init-date",
        from: (date: Timestamp) => {
          return date ? of(date.toDate()) : of(date);
        },
      },
      number: { name: "number" },
      retirementDate: {
        name: "retirement-date",
        from: (date: Timestamp) => {
          return date != null ? of(date.toDate()) : of(date);
        },
      },
      teamId: { name: "team-id" },
      userId: { name: "user-id" },
      kindMember: { name: "kind-member", default: "player" },
      id: { name: "id" },
    };
  }
}
