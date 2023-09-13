import { MatchesByRefereeIdEntity} from '@deporty-org/entities'
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
export class MatchesByRefereeIdMapper extends Mapper<MatchesByRefereeIdEntity> {
  constructor(   
  ) {
    super();
    this.attributesMapper = {
       refereeId:{name:"referee-id"},
       tournamentId:{name:"tournament-id"},
       kind:{name:"kind"},
       id:{name:"id"},
       fixtureStageId:{name:"fixture-stage-id"},
       groupId:{name:"group-id"},
       matchId:{name:"match-id"},
    };
  }
}
