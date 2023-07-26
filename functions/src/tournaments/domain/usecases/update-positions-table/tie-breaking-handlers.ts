import {
  AdvancedTieBreakingOrderEnum,
  BasicTieBreakingOrderEnum,
} from '@deporty-org/entities/organizations';
import { Observable, of } from 'rxjs';
import { GetAnyMatchByTeamIdsUsecase } from '../groups/get-any-match-by-team-ids/get-any-match-by-team-ids.usecase';
import { Id, MatchEntity } from '@deporty-org/entities';
import { map } from 'rxjs/operators';

export interface BasicTieBreakingOrderConfig {
  operator: (a: number, b: number) => 0 | 1 | -1;
  property: string;
}

export interface AdvancedTieBreakingOrderConfig {
  operator: (...params: any) => Observable<0 | 1 | -1>;
}

export function preferMajor(a: number, b: number): 0 | 1 | -1 {
  return a < b ? 1 : a > b ? -1 : 0;
}

export function preferMinor(a: number, b: number): 0 | 1 | -1 {
  return a > b ? 1 : a < b ? -1 : 0;
}

export const BASIC_TIE_BREAKING_ORDER_MAP: {
  [initial in BasicTieBreakingOrderEnum]: BasicTieBreakingOrderConfig;
} = {
  GA: {
    operator: preferMinor,
    property: 'goalsAgainst',
  },
  GAPM: {
    operator: preferMinor,
    property: 'goalsAgainstPerMatch',
  },
  GD: {
    operator: preferMajor,
    property: 'goalsDifference',
  },
  GIF: {
    operator: preferMajor,
    property: 'goalsInFavor',
  },
  FP: {
    operator: preferMinor,
    property: 'fairPlay',
  },
  LM: {
    operator: preferMinor,
    property: 'lostMatches',
  },
  PM: {
    operator: preferMinor,
    property: 'playedMatches',
  },

  TM: {
    operator: preferMajor,
    property: 'tiedMatches',
  },
  WM: {
    operator: preferMajor,
    property: 'wonMatches',
  },
};

export const ADVANCED_TIE_BREAKING_ORDER_MAP: {
  [initial in AdvancedTieBreakingOrderEnum]: AdvancedTieBreakingOrderConfig;
} = {
  BP: {
    operator: () => {
      return of(0);
    },
  },
  BPGT: {
    operator: () => {
      return of(0);
    },
  },
  IP: {
    operator: () => {
      return of(0);
    },
  },
  WB2: {
    operator: (
      getAnyMatchByTeamIdsUsecase: GetAnyMatchByTeamIdsUsecase,
      teamAId: Id,
      teamBId: Id,
      meta
    ) => {
      return getAnyMatchByTeamIdsUsecase
        .call({
          fixtureStageId: meta.fixtureStageId,
          groupId: meta.groupId,
          teamAId,
          teamBId,
          tournamentId: meta.tournamentId,
        })
        .pipe(
          map((match: MatchEntity | undefined) => {
            if (!match) return 0;
            const result = getWinnerTeam(match);
            if (!result) return 0;
            return result.winner === match.teamAId ? 1 : -1;
          })
        );
    },
  },
};

export function getWinnerTeam(match: MatchEntity):
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
