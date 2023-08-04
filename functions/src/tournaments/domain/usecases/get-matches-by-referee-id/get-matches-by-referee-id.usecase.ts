import { Id, MatchEntity } from "@deporty-org/entities";
import { Usecase } from "../../../../core/usecase";
import { Observable } from "rxjs";
import { MatchesByRefereeIdContract } from "../../contracts/matches-by-referee-id.contract";

export class GetMatchesByRefereeIdUsecase extends Usecase<Id,Array<MatchEntity>>{

    constructor(private matchesByRefereeIdContract:MatchesByRefereeIdContract)
    {
      super()
    }

    call(refereId: string): Observable<MatchEntity[]> {
        
       return this.matchesByRefereeIdContract.filter(
        {
            refereId:{operator:"==",value:refereId},
        }
       )
    }

}