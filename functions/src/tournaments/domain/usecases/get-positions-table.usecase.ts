import {
  MatchEntity,
  PointsStadistics,
} from '@deporty-org/entities/tournaments';
import { Observable, of } from 'rxjs';
import { Usecase } from '../../../core/usecase';
import { Id } from '@deporty-org/entities';
type Stadistics = Omit<PointsStadistics, 'teamId'>;

export type TieBreakingOrder =
  | 'GA'
  | 'GAPM'
  | 'GD'
  | 'GIF'
  | 'FP'
  | 'LM'
  | 'PM'
  | 'P'
  | 'TM'
  | 'WM';

export enum TieBreakingOrderEnum {
  'GA' = 'GA',
  'GAPM' = 'GAPM',
  'GD' = 'GD',
  'GIF' = 'GIF',
  'FP' = 'FP',
  'LM' = 'LM',
  'PM' = 'PM',
  'P' = 'P',
  'TM' = 'TM',
  'WM' = 'WM',
}

export const TieBreakingOrderMap = {
  GA: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsAgainst',
  },
  GAPM: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsAgainstPerMatch',
  },
  GD: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsDifference',
  },
  GIF: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'goalsInFavor',
  },
  FP: {
    operator: (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0),
    property: 'fairPlay',
  },
  LM: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'lostMatches',
  },
  PM: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'playedMatches',
  },
  P: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'points',
  },
  TM: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'tiedMatches',
  },
  WM: {
    operator: (a: number, b: number) => (a < b ? 1 : a > b ? -1 : 0),
    property: 'wonMatches',
  },
};

export interface Params {
  matches: MatchEntity[];
  tieBreakingOrder?: TieBreakingOrder[];
  teamIds: Id[];
}
type Table = {
  [teamId: string]: Omit<PointsStadistics, 'teamId'>;
};

export class GetPositionsTableUsecase extends Usecase<
  Params,
  PointsStadistics[]
> {
  constructor() {
    super();
  }

  call(param: Params): Observable<PointsStadistics[]> {
    const teamIds = param.teamIds || [];
    const tieBreakingOrder: TieBreakingOrder[] = param.tieBreakingOrder || [
      'P',
      'GD',
      'FP',
    ];
    const table: {
      [teamId: Id]: Stadistics;
    } = {};
    const matchesToEvaluate = param.matches.filter(
      (m) => m.status === 'completed'
    );
    for (const match of matchesToEvaluate) {
      const teamAId = match.teamAId;
      const teamBId = match.teamBId;

      const teamAIdFlag = teamIds.includes(teamAId);
      const teamBIdFlag = teamIds.includes(teamBId);

      const failPlayStadistics =
        this.getFairPlayerStadisticFromMatchByTeam(match);

      if (!(teamAId in table) && teamAIdFlag) {
        table[teamAId] = this.generateEmptyStadistics();
      }
      if (!(teamBId in table) && teamBIdFlag) {
        table[teamBId] = this.generateEmptyStadistics();
      }

      this.setStadistic(
        teamIds,
        teamAId,
        table,
        'fairPlay',
        failPlayStadistics.teamA
      );
      this.setStadistic(teamIds, teamAId, table, 'playedMatches', 1);
      this.setStadistic(
        teamIds,
        teamBId,
        table,
        'fairPlay',
        failPlayStadistics.teamB
      );
      this.setStadistic(teamIds, teamBId, table, 'playedMatches', 1);

      if (match.score) {
        this.setGoalStadistics(teamIds, table, teamAId, match, teamBId);
      }

      const winnerTeam = this.getWinnerTeam(match);

      if (winnerTeam !== undefined) {
        if (winnerTeam) {
          this.setStadistic(teamIds, winnerTeam.winner, table, 'points', 3);
          this.setStadistic(teamIds, winnerTeam.winner, table, 'wonMatches', 1);
          this.setStadistic(teamIds, winnerTeam.loser, table, 'lostMatches', 1);
        } else if (winnerTeam === null) {
          this.setStadistic(teamIds, teamAId, table, 'tiedMatches', 1);
          this.setStadistic(teamIds, teamAId, table, 'points', 1);
          this.setStadistic(teamIds, teamBId, table, 'tiedMatches', 1);
          this.setStadistic(teamIds, teamBId, table, 'points', 1);
        }
      }
    }

    const previusTable = Object.keys(table)
      .map((teamId: string) => {
        const value = table[teamId];
        return {
          teamId,
          ...value,
          goalsAgainstPerMatch:
            Math.trunc((value.goalsAgainst / value.playedMatches) * 100) / 100,
        } as PointsStadistics;
      })
      .sort((prev, next) => {
        return this.order(prev, next, tieBreakingOrder, 0);
      });
    return of(previusTable);
  }

  private generateEmptyStadistics(): Omit<PointsStadistics, 'teamId'> {
    return {
      goalsAgainst: 0,
      goalsAgainstPerMatch: 0,
      goalsDifference: 0,
      goalsInFavor: 0,
      fairPlay: 0,
      lostMatches: 0,
      playedMatches: 0,
      points: 0,
      tiedMatches: 0,
      wonMatches: 0,
    };
  }

  private getFairPlayerStadisticFromMatchByTeam(match: MatchEntity) {
    const yellowCardScale = 1;
    const redCardScale = 2;
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

  private getWinnerTeam(match: MatchEntity):
    | {
        winner: Id;
        loser: Id;
      }
    | null
    | undefined {
    let response = undefined;
    if (
      !match.score ||
      match.score.teamA == null ||
      match.score.teamA == undefined ||
      match.score.teamB == null ||
      match.score.teamB == undefined
    ) {
      return undefined;
    }

    if (match.score.teamA < match.score.teamB) {
      response = {
        winner: match.teamBId,
        loser: match.teamAId,
      };
    } else if (match.score.teamA > match.score.teamB) {
      response = {
        winner: match.teamAId,
        loser: match.teamBId,
      };
    } else {
      response = null;
    }

    return response;
  }

  private order(
    a: PointsStadistics,
    b: PointsStadistics,
    order: TieBreakingOrder[],
    index: number
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
    const config = TieBreakingOrderMap[currentOrder];
    const property = config.property;
    const operator = config.operator;
    const result = operator((a as any)[property], (b as any)[property]);
    if (result === 0) {
      return this.order(a, b, order, index + 1);
    } else {
      return result;
    }
  }

  private setGoalStadistics(
    teamIds: Id[],

    table: Table,
    teamAId: string,
    match: MatchEntity,
    teamBId: string
  ) {
    this.setStadistic(
      teamIds,
      teamAId,
      table,
      'goalsAgainst',
      match.score!.teamB
    );
    this.setStadistic(
      teamIds,
      teamAId,
      table,
      'goalsInFavor',
      match.score!.teamA
    );
    this.setStadistic(
      teamIds,
      teamAId,
      table,
      'goalsDifference',
      match.score!.teamA - match.score!.teamB
    );

    this.setStadistic(
      teamIds,
      teamBId,
      table,
      'goalsAgainst',
      match.score!.teamA
    );
    this.setStadistic(
      teamIds,
      teamBId,
      table,
      'goalsInFavor',
      match.score!.teamB
    );
    this.setStadistic(
      teamIds,
      teamBId,
      table,
      'goalsDifference',
      match.score!.teamB - match.score!.teamA
    );
  }

  private setStadistic(
    teamIds: Id[],
    teamId: Id,
    table: Table,
    stadistic: keyof PointsStadistics,
    increment: number
  ): void {
    if (teamIds.includes(teamId) && increment) {
      (table[teamId] as any)[stadistic] =
        (table[teamId] as any)[stadistic] + increment;
    }
  }
}
