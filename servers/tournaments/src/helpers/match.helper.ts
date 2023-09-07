import { MatchEntity } from '@deporty-org/entities/tournaments';

export function existSMatchInList(
  match: MatchEntity,
  matches: MatchEntity[]
): boolean {
  return (
    matches.filter((m: MatchEntity) => {
      return (
        (m.teamAId === match.teamAId && m.teamBId === match.teamBId) ||
        (m.teamAId === match.teamBId && m.teamBId === match.teamAId)
      );
    }).length > 0
  );
}

export function findMatchInList(
  match: MatchEntity,
  matches: MatchEntity[]
): number {
  return matches.findIndex((m) => {
    return (
      (m.teamAId === match.teamAId && m.teamBId === match.teamBId) ||
      (m.teamAId === match.teamBId && m.teamBId === match.teamAId)
    );
  });
}
