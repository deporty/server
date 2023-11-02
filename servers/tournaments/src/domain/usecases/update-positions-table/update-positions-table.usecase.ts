import { Id } from '@deporty-org/entities';
import { NegativePointsPerCard, PointsConfiguration, TieBreakingOrder } from '@deporty-org/entities/organizations';
import { FlatPointsStadistics, MatchEntity, PositionsTable } from '@deporty-org/entities/tournaments';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetAnyMatchByTeamIdsUsecase } from '../groups/get-any-match-by-team-ids/get-any-match-by-team-ids.usecase';
import { quicksort } from './crespo';
import { getWinnerTeam } from './tie-breaking-handlers';
import { Table, calculateGoalsAgainsPerMatch, generateEmptyStadistics, setStadistic } from './update-positions-table.helpers';

export interface Params {
  availableTeams: Id[];
  match: MatchEntity;
  meta: any;
  negativePointsPerCard: NegativePointsPerCard;
  pointsConfiguration: PointsConfiguration;
  positionsTable?: PositionsTable;
  tieBreakingOrder: TieBreakingOrder[];
}
export class UpdatePositionTableUsecase extends Usecase<Params, PositionsTable> {
  constructor(private getAnyMatchByTeamIdsUsecase: GetAnyMatchByTeamIdsUsecase) {
    super();
  }

  call(param: Params): Observable<PositionsTable> {
    const teamIds = param.availableTeams || [];
    const tieBreakingOrder: TieBreakingOrder[] = param.tieBreakingOrder;

    const positionsTable = param.positionsTable || {
      analizedMatches: [],
      table: [],
    };
    const table = positionsTable.table;
    const analizedMatches = positionsTable.analizedMatches;
    
    const match = param.match;
    if (!analizedMatches.includes(match.id!)) {
      analizedMatches.push(match.id!);
      const teamAId = match.teamAId;
      const teamBId = match.teamBId;

      const teamAIdFlag = teamIds.includes(teamAId);
      const teamBIdFlag = teamIds.includes(teamBId);

      const failPlayStadistics = this.getFairPlayerStadisticFromMatchByTeam(match, param.negativePointsPerCard);

      const existsA = table.find((x) => x.teamId === teamAId);
      const existsB = table.find((x) => x.teamId === teamBId);

      if (!existsA && teamAIdFlag) {
        table.push({
          teamId: teamAId,
          stadistics: generateEmptyStadistics(),
          wasByRandom: false,
        });
      }
      if (!existsB && teamBIdFlag) {
        table.push({
          teamId: teamBId,
          stadistics: generateEmptyStadistics(),
          wasByRandom: false,
        });
      }

      setStadistic(teamIds, teamAId, table, 'fairPlay', failPlayStadistics.teamA);
      setStadistic(teamIds, teamAId, table, 'playedMatches', 1);
      setStadistic(teamIds, teamBId, table, 'fairPlay', failPlayStadistics.teamB);
      setStadistic(teamIds, teamBId, table, 'playedMatches', 1);

      if (match.score) {
        this.setGoalStadistics(teamIds, table, teamAId, match, teamBId);
      }

      const winnerTeam = getWinnerTeam(match);

      if (winnerTeam !== undefined) {
        if (winnerTeam) {
          setStadistic(teamIds, winnerTeam.winner, table, 'points', param.pointsConfiguration.wonMatchPoints);
          setStadistic(teamIds, winnerTeam.winner, table, 'wonMatches', 1);
          setStadistic(teamIds, winnerTeam.winner, table, 'points', param.pointsConfiguration.lostMatchPoints);
          setStadistic(teamIds, winnerTeam.loser, table, 'lostMatches', 1);
        } else if (winnerTeam === null) {
          setStadistic(teamIds, teamAId, table, 'tiedMatches', 1);
          setStadistic(teamIds, teamAId, table, 'points', param.pointsConfiguration.tieMatchPoints);
          setStadistic(teamIds, teamBId, table, 'tiedMatches', 1);
          setStadistic(teamIds, teamBId, table, 'points', param.pointsConfiguration.tieMatchPoints);
        }
      }

      const calculatedTable = calculateGoalsAgainsPerMatch(table);
      const groupedTable = this.orderByPoints(calculatedTable);

      const response = this.resolveTies(groupedTable, tieBreakingOrder, param).pipe(
        map((table: Table) => {
          return {
            analizedMatches,
            table: table,
          };
        })
      );
      return response;
    }

    return of(positionsTable);
  }

  private getFairPlayerStadisticFromMatchByTeam(match: MatchEntity, negativePointsPerCard: NegativePointsPerCard) {
    const yellowCardScale = negativePointsPerCard.yellowCardsNegativePoints;
    const redCardScale = negativePointsPerCard.redCardsNegativePoints;
    const response = {
      teamA: 0,
      teamB: 0,
    };
    const fn = (match: MatchEntity, response: { teamA: number; teamB: number }, key: 'teamA' | 'teamB') => {
      if (match.stadistics && match.stadistics[key]) {
        for (const stadistic of (match.stadistics as any)[key]) {
          response[key] = response[key] + stadistic.totalYellowCards * yellowCardScale + stadistic.totalRedCards * redCardScale;
        }
      }
    };
    fn(match, response, 'teamA');
    fn(match, response, 'teamB');
    return response;
  }

  private orderByPoints(table: Table) {
    const groupedTable: any = {};
    for (const item of table) {
      const points = item.stadistics.points.toString();

      if (!groupedTable[points]) {
        groupedTable[points] = [];
      }

      groupedTable[points].push(item);
    }

    const keys = Object.keys(groupedTable)
      .map((x) => parseInt(x))
      .sort((a, b) => b - a);

    const res = [];
    for (const k of keys) {
      res.push(groupedTable[k.toString()]);
    }

    return res;
  }

  private resolveTies(
    groupedTable: {
      teamId: string;
      stadistics: FlatPointsStadistics;
      wasByRandom: boolean;
    }[][],
    tieBreakingOrder: TieBreakingOrder[],
    param: Params
  ): Observable<Table> {
    const response: Table = [];

    const temp = [];

    for (const group of groupedTable) {
      const $orderedTable = quicksort(group, tieBreakingOrder, group.length, param, this.getAnyMatchByTeamIdsUsecase);
      temp.push($orderedTable);
    }
    if (temp.length == 0) {
      return of(response);
    }

    return zip(...temp).pipe(
      map((data) => {
        return data.reduce((acc, prev) => {
          acc.push(...prev);
          return acc;
        }, []);
      })
    );
  }

  private setGoalStadistics(
    teamIds: Id[],

    table: Table,
    teamAId: string,
    match: MatchEntity,
    teamBId: string
  ) {
    setStadistic(teamIds, teamAId, table, 'goalsAgainst', match.score!.teamB);
    setStadistic(teamIds, teamAId, table, 'goalsInFavor', match.score!.teamA);
    setStadistic(teamIds, teamAId, table, 'goalsDifference', match.score!.teamA - match.score!.teamB);

    setStadistic(teamIds, teamBId, table, 'goalsAgainst', match.score!.teamA);
    setStadistic(teamIds, teamBId, table, 'goalsInFavor', match.score!.teamB);
    setStadistic(teamIds, teamBId, table, 'goalsDifference', match.score!.teamB - match.score!.teamA);
  }
}
