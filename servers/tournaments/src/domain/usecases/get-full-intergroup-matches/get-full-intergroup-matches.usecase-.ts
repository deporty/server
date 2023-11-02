import { FixtureStageEntity, IntergroupMatchEntity, MatchStatusType } from '@deporty-org/entities/tournaments';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetFixtureStagesByTournamentUsecase } from '../fixture-stages/get-fixture-stages-by-tournament/get-fixture-stages-by-tournament.usecase';
import { GetIntergroupMatchesUsecase } from '../intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase';
import { Id } from '@deporty-org/entities';

export interface Param {
  tournamentId: Id;
  status?: MatchStatusType[];
}

export interface Response {
  [index: string]: {
    order: number;
    matches: IntergroupMatchEntity[];
  };
}

export class GetFullIntergroupMatchesUsecase extends Usecase<Param, Response> {
  constructor(
    private getIntergroupMatchesUsecase: GetIntergroupMatchesUsecase,
    private getFixtureStagesByTournamentUsecase: GetFixtureStagesByTournamentUsecase
  ) {
    super();
  }
  call(param: Param): Observable<Response> {
    const status = param.status || ['completed', 'editing', 'in-review', 'published', 'running'];
    return this.getFixtureStagesByTournamentUsecase.call(param.tournamentId).pipe(
      mergeMap((fixtureModel: FixtureStageEntity[]) => {
        const response: any[] = [];
        for (const stage of fixtureModel) {
          response.push(
            this.getIntergroupMatchesUsecase.call({
              fixtureStageId: stage.id!,
              states: status,

              tournamentId: param.tournamentId,
            }).pipe(
              map((matches)=>{
                return {
                  ...stage,
                  matches
                }
              })
            )
          );
        }
        return response.length > 0 ? zip(...response) : of([]);
      }),
      map((x: any[]) => {
        const response: Response = {};
       
        
        
        for (const stage of x) {
          if (stage.id && !(stage.id in response)) {
            response[stage.id] = {
              order: stage.order,
              matches: stage.matches,
            };
          }
        }
        return response;
      })
    );
  }
}
