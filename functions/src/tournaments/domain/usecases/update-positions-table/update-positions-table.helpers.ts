import { FlatPointsStadistics, Id, PointsStadistics, PositionsTable } from "@deporty-org/entities";

export type Table = PositionsTable['table'];


export function generateEmptyStadistics(): FlatPointsStadistics {
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

export function setStadistic(
  teamIds: Id[],
  teamId: Id,
  table: Table,
  stadistic: keyof PointsStadistics,
  increment: number
): void {
  if (teamIds.includes(teamId) && increment) {
    const item:
      | {
          teamId: string;
          stadistics: FlatPointsStadistics;
          wasByRandom: boolean;
        }
      | undefined = table.find((x) => x.teamId == teamId);

    if (item) {
      (item.stadistics as any)[stadistic] =
        (item.stadistics as any)[stadistic] + increment;
    }
  }
}


export function calculateGoalsAgainsPerMatch(
  table: {
    teamId: string;
    stadistics: FlatPointsStadistics;
    wasByRandom: boolean;
  }[]
) {
  return table.map(
    (row: {
      teamId: string;
      stadistics: FlatPointsStadistics;
      wasByRandom: boolean;
    }) => {
      const value = row;
      const goalsAgainstPerMatch =
        Math.trunc(
          (value.stadistics.goalsAgainst / value.stadistics.playedMatches) *
            100
        ) / 100;
      return {
        teamId: row.teamId,
        stadistics: {
          ...value.stadistics,
          goalsAgainstPerMatch,
        },
        wasByRandom: value.wasByRandom,
      };
    }
  );
}
