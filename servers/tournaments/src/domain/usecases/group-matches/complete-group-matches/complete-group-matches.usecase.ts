import { Id, MatchEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { GetNewMatchesToAddInGroupUsecase } from '../get-new-matches-to-add-in-group/get-new-matches-to-add-in-group.usecase';
import { AddMatchToGroupInsideTournamentUsecase } from '../add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.usecase';
import { map, mergeMap } from 'rxjs/operators';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;

  teamIds?: Id[];
}
export class CompleteGroupMatchesUsecase extends Usecase<Param, void> {
  constructor(
    private getNewMatchesToAddInGroupUsecase: GetNewMatchesToAddInGroupUsecase,
    private addMatchToGroupInsideTournamentUsecase: AddMatchToGroupInsideTournamentUsecase
  ) {
    super();
  }

  call(param: Param): Observable<void> {
    
    return this.getNewMatchesToAddInGroupUsecase.call(param).pipe(
      mergeMap((newMatches: MatchEntity[]) => {
        const temp = [];
        
        for (const match of newMatches) {
          temp.push(
            this.addMatchToGroupInsideTournamentUsecase.call({
              fixtureStageId: param.fixtureStageId,
              groupId: param.groupId,
              tournamentId: param.tournamentId,
              teamAId: match.teamAId,
              teamBId: match.teamBId,
            })
          );
        }

        return temp.length == 0
          ? of(void 0)
          : zip(...temp).pipe(map((x) => void 0));
      })
    );
  }
}
