import { Id } from '@deporty-org/entities';
import {
  FlatPointsStadistics,
  MatchEntity,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { Observable, of } from 'rxjs';
import { Usecase } from '../../../../core/usecase';
import {
  AdvancedTieBreakingOrderEnum,
  BasicTieBreakingOrderEnum,
  NegativePointsPerCard,
  PointsConfiguration,
  TieBreakingOrder,
} from '@deporty-org/entities/organizations';
import {
  BasicTieBreakingOrderConfig,
  BASIC_TIE_BREAKING_ORDER_MAP,
  AdvancedTieBreakingOrderConfig,
  getWinnerTeam,
  ADVANCED_TIE_BREAKING_ORDER_MAP,
} from './tie-breaking-handlers';
import { GetAnyMatchByTeamIdsUsecase } from '../groups/get-any-match-by-team-ids/get-any-match-by-team-ids.usecase';
import {
  Table,
  calculateGoalsAgainsPerMatch,
  generateEmptyStadistics,
  setStadistic,
} from './update-positions-table.helpers';
import { map } from 'rxjs/operators';

export interface Params {
  match: MatchEntity;
  availableTeams: Id[];
  tieBreakingOrder: TieBreakingOrder[];
  negativePointsPerCard: NegativePointsPerCard;
  pointsConfiguration: PointsConfiguration;
  positionsTable?: PositionsTable;
  meta: any;
}
export class UpdatePositionTableUsecase extends Usecase<
  Params,
  PositionsTable
> {
  constructor(
    private getAnyMatchByTeamIdsUsecase: GetAnyMatchByTeamIdsUsecase
  ) {
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

      const failPlayStadistics = this.getFairPlayerStadisticFromMatchByTeam(
        match,
        param.negativePointsPerCard
      );

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

      setStadistic(
        teamIds,
        teamAId,
        table,
        'fairPlay',
        failPlayStadistics.teamA
      );
      setStadistic(teamIds, teamAId, table, 'playedMatches', 1);
      setStadistic(
        teamIds,
        teamBId,
        table,
        'fairPlay',
        failPlayStadistics.teamB
      );
      setStadistic(teamIds, teamBId, table, 'playedMatches', 1);

      if (match.score) {
        this.setGoalStadistics(teamIds, table, teamAId, match, teamBId);
      }

      const winnerTeam = getWinnerTeam(match);

      if (winnerTeam !== undefined) {
        if (winnerTeam) {
          setStadistic(
            teamIds,
            winnerTeam.winner,
            table,
            'points',
            param.pointsConfiguration.wonMatchPoints
          );
          setStadistic(teamIds, winnerTeam.winner, table, 'wonMatches', 1);
          setStadistic(
            teamIds,
            winnerTeam.winner,
            table,
            'points',
            param.pointsConfiguration.lostMatchPoints
          );
          setStadistic(teamIds, winnerTeam.loser, table, 'lostMatches', 1);
        } else if (winnerTeam === null) {
          setStadistic(teamIds, teamAId, table, 'tiedMatches', 1);
          setStadistic(
            teamIds,
            teamAId,
            table,
            'points',
            param.pointsConfiguration.tieMatchPoints
          );
          setStadistic(teamIds, teamBId, table, 'tiedMatches', 1);
          setStadistic(
            teamIds,
            teamBId,
            table,
            'points',
            param.pointsConfiguration.tieMatchPoints
          );
        }
      }

      console.log();
      console.log('Original table: ', table);
      console.log();

      const calculatedTable = calculateGoalsAgainsPerMatch(table);
      const groupedTable = this.orderByPoints(calculatedTable);

      const response = this.resolveTies(
        groupedTable,
        tieBreakingOrder,
        param
      ).pipe(
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

    for (const group of groupedTable) {
      console.log('...');
      console.log(JSON.stringify(group, null, 2));
      console.log('...');
    }
    for (const group of groupedTable) {
      // const len = group.length;
      const orderedTable = group.sort((prev, next) => {
        return this.order(prev, next, tieBreakingOrder, 0, param);
      });
      response.push(...orderedTable);
    }
    return of(response);
  }

  private getFairPlayerStadisticFromMatchByTeam(
    match: MatchEntity,
    negativePointsPerCard: NegativePointsPerCard
  ) {
    const yellowCardScale = negativePointsPerCard.yellowCardsNegativePoints;
    const redCardScale = negativePointsPerCard.redCardsNegativePoints;
    const response = {
      teamA: 0,
      teamB: 0,
    };
    const fn = (
      match: MatchEntity,
      response: { teamA: number; teamB: number },
      key: 'teamA' | 'teamB'
    ) => {
      if (match.stadistics && match.stadistics[key]) {
        for (const stadistic of (match.stadistics as any)[key]) {
          response[key] =
            response[key] +
            stadistic.totalYellowCards * yellowCardScale +
            stadistic.totalRedCards * redCardScale;
        }
      }
    };
    fn(match, response, 'teamA');
    fn(match, response, 'teamB');
    return response;
  }

  private orderByPoints(table: Table) {
    const groupedTable = [];
    let prevPoints = null;
    let group: Table = [];
    for (const item of table) {
      if (prevPoints === null) {
        prevPoints = item.stadistics.points;
      }

      if (item.stadistics.points === prevPoints) {
        group.push(item);
      } else {
        groupedTable.push([...group]);
        group = [item];
      }
    }
    groupedTable.push([...group]);
    return groupedTable.sort((a, b) => {
      const a0 = a[0];
      const b0 = b[0];
      return -1 * (a0.stadistics.points - b0.stadistics.points);
    });
  }

  private order(
    a: {
      teamId: string;
      stadistics: FlatPointsStadistics;
      wasByRandom: boolean;
    },
    b: {
      teamId: string;
      stadistics: FlatPointsStadistics;
      wasByRandom: boolean;
    },
    order: TieBreakingOrder[],
    index: number,
    param: any
  ): number {
    if (index === order.length) {
      const randomNumber = Math.random();

      if (randomNumber > 0.5) {
        return -1;
      } else {
        return 1;
      }
    }
    const currentOrder = order[index];

    if (
      BASIC_TIE_BREAKING_ORDER_MAP[currentOrder as BasicTieBreakingOrderEnum]
    ) {
      const config: BasicTieBreakingOrderConfig =
        BASIC_TIE_BREAKING_ORDER_MAP[currentOrder as BasicTieBreakingOrderEnum];

      const property = config.property;
      const operator = config.operator;
      const result = operator(
        (a.stadistics as any)[property],
        (b.stadistics as any)[property]
      );
      if (result === 0) {
        return this.order(a, b, order, index + 1, param);
      } else {
        return result;
      }
    } else {
      const config: AdvancedTieBreakingOrderConfig =
        ADVANCED_TIE_BREAKING_ORDER_MAP[
          currentOrder as AdvancedTieBreakingOrderEnum
        ];

      const operator = config.operator;

      if (currentOrder == 'WB2') {
        operator(
          this.getAnyMatchByTeamIdsUsecase,
          a.teamId,
          b.teamId,
          param.meta
        );
      }

      return 0;
    }
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
    setStadistic(
      teamIds,
      teamAId,
      table,
      'goalsDifference',
      match.score!.teamA - match.score!.teamB
    );

    setStadistic(teamIds, teamBId, table, 'goalsAgainst', match.score!.teamA);
    setStadistic(teamIds, teamBId, table, 'goalsInFavor', match.score!.teamB);
    setStadistic(
      teamIds,
      teamBId,
      table,
      'goalsDifference',
      match.score!.teamB - match.score!.teamA
    );
  }
}
