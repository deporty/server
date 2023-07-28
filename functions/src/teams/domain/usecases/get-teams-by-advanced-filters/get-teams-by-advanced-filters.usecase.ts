import { TeamEntity } from "@deporty-org/entities";
import { Observable } from "rxjs";
import { Filters } from "../../../../core/helpers";
import { Usecase } from "../../../../core/usecase";
import { TeamContract } from "../../contracts/team.contract";

export class GetTeamByAdvancedFiltersUsecase extends Usecase<
  any,
  Array<TeamEntity>
> {
  constructor(private teamContract: TeamContract) {
    super();
  }
  call(filters: Filters): Observable<Array<TeamEntity>> {
    return this.teamContract.filter(filters);
  }
}
