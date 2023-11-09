import { Id } from '@deporty-org/entities';
import { MatchEntity, StadisticSpecification, Stadistics } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetAllMatchesInsideTournamentUsecase } from '../get-all-matches-inside-tournament/get-all-matches-inside-tournament.usecase';

export interface StadisticResume {
  goals: number;
  teamId: Id;
  ammountOfMatches: number;
  average: number;
}

export class GetLessDefeatedFenceReportUsecase extends Usecase<string, StadisticResume[]> {
  constructor(private getAllMatchesInsideTournamentUsecase: GetAllMatchesInsideTournamentUsecase) {
    super();
  }

  call(tournamentId: string): Observable<StadisticResume[]> {
    return this.getAllMatchesInsideTournamentUsecase.call({ tournamentId, status: ['completed', 'in-review'] }).pipe(
      map((matches: MatchEntity[]) => {
        const scorers: StadisticResume[] = [];

        for (const match of matches) {
          console.log(' -- ', match.id, match.teamAId, match.teamBId);

          if (match.stadistics) {
            console.log('Stadistics ', match.stadistics);
            console.log();

            this.newFunction({
              stadisticsByTeam: match.stadistics.teamB,
              team: match.teamAId,
              scorers,
            });
            this.newFunction({
              stadisticsByTeam: match.stadistics.teamA,
              team: match.teamBId,
              scorers,
            });
          }
        }

        const response: StadisticResume[] = scorers;
        return response
          .map((x) => {
            return { ...x, average: x['goals'] / x['ammountOfMatches'] };
          })
          .sort((prev, next) => {
            return prev.goals - next.goals;
          });
      })
    );
  }

  isNotStadisticsEmpty(stadistic: Stadistics | undefined) {
    return stadistic && ((stadistic.teamA && stadistic.teamA.length > 0) || (stadistic.teamB && stadistic.teamB.length > 0));
  }

  private findStadisticInScores(scorers: StadisticResume[], teamId: Id): StadisticResume | undefined {
    const response = scorers.filter((x) => {
      return x.teamId === teamId;
    });
    return response.length === 1 ? response.pop() : undefined;
  }

  private newFunction({
    stadisticsByTeam,
    team,
    scorers,
  }: {
    stadisticsByTeam: StadisticSpecification[] | undefined;
    team: Id;
    scorers: StadisticResume[];
  }): void {
    let stadistic = this.findStadisticInScores(scorers, team);

    if (!stadistic) {
      stadistic = {
        goals: 0,
        ammountOfMatches: 0,
        teamId: team,
        average: 0,
      };
      scorers.push(stadistic);
    }

    if (!!stadisticsByTeam) {
      stadistic['ammountOfMatches'] = stadistic['ammountOfMatches'] + 1;
      for (const playerStadistic of stadisticsByTeam) {
        if (playerStadistic.totalGoals) {
          stadistic['goals'] = stadistic['goals'] + playerStadistic.totalGoals;
        }
      }
    }
  }
}
