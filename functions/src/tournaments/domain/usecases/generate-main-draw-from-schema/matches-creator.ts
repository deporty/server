//  function isAvalidConfiguration(groupConfig: number[]) {
//   return groupConfig.reduce((previousValue: boolean, currentValue: number) => {
//     return previousValue && currentValue > 0;
//   }, true);
// }
//  function isAvalidTree(matches: string[][]) {
//   return matches.reduce((previousValue: boolean, currentValue: string[]) => {
//     return (
//       previousValue &&
//       currentValue.reduce((previousValue1: boolean, currentValue1: string) => {
//         return previousValue1 && !!currentValue1;
//       }, true)
//     );
//   }, true);
// }

import { DEFAULT_GROUP_SIZE_LABELS, Id, NodeMatchEntity } from '@deporty-org/entities';

interface TeamsInNucleon {
  groupLabel: string;
  position: number;
  teamId: Id;
}
interface Nucleon {
  logicalTag: string;
  teams: TeamsInNucleon[];
}

// function _isEmpty(teamsIdentifiers: any[][]) {
//   return teamsIdentifiers.reduce((previousValue: boolean, currentValue: any[]) => {
//     return previousValue && currentValue.length == 0;
//   }, true);
// }
function _isEmptyNucleon(nucleones: Nucleon[]) {
  return nucleones.reduce((previousValue: boolean, currentValue: Nucleon) => {
    return previousValue && currentValue.teams.length == 0;
  }, true);
}

// function _createTree(index: number, teamsIdentifiers: string[][], response: string[][]) {
//   if (_isEmpty(teamsIdentifiers)) {
//     return;
//   }
//   const currentGroup = teamsIdentifiers[index];

//   const nextIndex = index + 1 < teamsIdentifiers.length ? index + 1 : 0;
//   const nextGroup = teamsIdentifiers[nextIndex];

//   const A0Index = 0;
//   const B1Index = nextGroup.length - 1;

//   const A0: string = currentGroup.splice(A0Index, 1)[0];
//   const B1: string = nextGroup.splice(B1Index, 1)[0];
//   const info = [A0, B1];
//   response.push(info);

//   _createTree(nextIndex, teamsIdentifiers, response);
// }

function _createNucleonesMatches(groupIndex: number, nucleones: Nucleon[], response: TeamsInNucleon[][]) {
  if (_isEmptyNucleon(nucleones)) {
    return;
  }
  const currentLogicalGroup = nucleones[groupIndex].teams;

  const nextIndex = groupIndex + 1 < nucleones.length ? groupIndex + 1 : 0;
  const nextGroup = nucleones[nextIndex];

  const A0Index = 0;
  const B1Index = nextGroup.teams.length - 1;

  const A0: TeamsInNucleon = currentLogicalGroup.splice(A0Index, 1)[0];
  const B1: TeamsInNucleon = nextGroup.teams.splice(B1Index, 1)[0];
  const info = [A0, B1];
  response.push(info);

  _createNucleonesMatches(nextIndex, nucleones, response);
}

function _createPromotedNucleonesMatches(
  groupsAvailablesIndex: number[],
  nucleones: Nucleon[],
  response: TeamsInNucleon[][],
  promoteAmmount: number
) {
  if (promoteAmmount == response.length) {
    return;
  }

  const groupAPosition = parseInt((Math.random() * (groupsAvailablesIndex.length - 1)).toFixed(0));
  const groupAIndex = groupsAvailablesIndex.splice(groupAPosition, 1)[0];
  const teamsInLogicalGroupA = nucleones[groupAIndex].teams;

  const groupBPosition = parseInt((Math.random() * (groupsAvailablesIndex.length - 1)).toFixed(0));
  const groupBIndex = groupsAvailablesIndex.splice(groupBPosition, 1)[0];
  const teamsInLogicalGroupB = nucleones[groupBIndex].teams;

  const A0: TeamsInNucleon = teamsInLogicalGroupA.splice(0, 1)[0];
  const B1: TeamsInNucleon = teamsInLogicalGroupB.splice(0, 1)[0];
  const info = [A0, B1];
  response.push(info);

  _createPromotedNucleonesMatches(groupsAvailablesIndex, nucleones, response, promoteAmmount);
}

function createNucleones(teamsIdentifiers: string[][]): Nucleon[] {
  const response: Nucleon[] = [];

  for (let i = 0; i < teamsIdentifiers.length; i++) {
    const group = teamsIdentifiers[i];

    const label = DEFAULT_GROUP_SIZE_LABELS[i];
    const teams = [];
    for (let j = 0; j < group.length; j++) {
      const teamId = group[j];

      teams.push({
        position: j,
        groupLabel: label,
        teamId,
      });
    }
    response.push({
      logicalTag: label,
      teams: teams,
    });
  }
  return response;
}

interface Params {
  groupLength: number;
  initialLevel: number;
  matchesInMaxLevel: number;
  nucleones: Nucleon[];
  totalMatches: number;
}
function reestructureNucleonesMatches(indexesWhereExistFirst: number[], nucleones: Nucleon[]): Nucleon[] {
  const completos: Nucleon[] = [];
  const noCompletos: Nucleon[] = [];

  let aproxLenght = 0;
  for (let i = 0; i < nucleones.length; i++) {
    const element = nucleones[i];
    const exist = indexesWhereExistFirst.find((x) => {
      return i == x;
    });

    if (exist != undefined) {
      aproxLenght += element.teams.length;
      completos.push({ ...element });
    } else {
      aproxLenght += element.teams.length + 1;
      noCompletos.push({ ...element });
    }
  }

  const teamsByGroupAverage = aproxLenght / nucleones.length;
  const full = [...completos];

  let i = 0;
  let identifier = `I${i}`;
  let newNucleon: Nucleon = {
    logicalTag: identifier,
    teams: [],
  };
  let currentNoCompleto;
  while (noCompletos.length > 0) {
    currentNoCompleto = noCompletos[0];

    const toAdd = Math.min(teamsByGroupAverage, currentNoCompleto.teams.length);
    newNucleon.teams.push(...currentNoCompleto.teams.splice(0, toAdd));

    if (newNucleon.teams.length == teamsByGroupAverage) {
      identifier = `I${i}`;

      full.push({ ...newNucleon });
      newNucleon = {
        logicalTag: identifier,
        teams: [],
      };
    }
    if (currentNoCompleto.teams.length == 0) {
      noCompletos.splice(i, 1);
    }
  }

  if (newNucleon.teams.length == teamsByGroupAverage) {
    identifier = `I${i}`;

    full.push({ ...newNucleon });
    newNucleon = {
      logicalTag: identifier,
      teams: [],
    };
  }

  return full;
}
function generateFlatMatches(params: Params): NodeMatch[] {
  const matchesToPromote = params.matchesInMaxLevel - params.totalMatches;

  const nucleonesCopy = [...params.nucleones];
  let flatMatches: TeamsInNucleon[][] = [];
  if (matchesToPromote == 0) {
    _createNucleonesMatches(0, nucleonesCopy, flatMatches);
    const nodeMatches = convertToNodeMatch(params.initialLevel, flatMatches);
    return nodeMatches;
  } else {
    const groupIndexes = Array.from(nucleonesCopy, (_, index) => index);
    const promotedMatches: TeamsInNucleon[][] = [];
    _createPromotedNucleonesMatches(groupIndexes, nucleonesCopy, promotedMatches, matchesToPromote);

    const noPromotedNucleonMatches: Nucleon[] = reestructureNucleonesMatches(groupIndexes, nucleonesCopy);

    const noPromotedMatches: TeamsInNucleon[][] = [];

    _createNucleonesMatches(0, noPromotedNucleonMatches, noPromotedMatches);

    const noPromotedNodeMatches = placeMatchInKey(params.initialLevel, true, noPromotedMatches);
    const promotedNodeMatches = placeMatchInKey(params.initialLevel - 1, false, promotedMatches);
    console.log('00000000000000000000000');
    console.log(noPromotedNodeMatches);
    console.log(promotedNodeMatches);

    console.log('00000000000000000000000');
    return [...noPromotedNodeMatches, ...promotedNodeMatches];
  }
}

function placeMatchInKey(level: number, expand: boolean, flatMatches: TeamsInNucleon[][]): NodeMatch[] {
  const total = Math.pow(2, level);
  let i = 0;
  let j = total - 1;
  let iDir = 1;
  let jDir = -1;
  const response: NodeMatch[] = [];
  if (expand) {
    i = total / 2 - 1;
    j = total / 2;
    iDir = -1;
    jDir = 1;
  }
  console.log('flatMatches', flatMatches);
  console.log(' - ', i, j, iDir, jDir);

  for (let index = 0; index < flatMatches.length; index += 2) {
    const fm = flatMatches[index];
    const fm2 = flatMatches[index + 1];

    response.push({
      key: i,
      level,
      match: {
        teamAId: fm[0].teamId,
        teamBId: fm[1].teamId,
      },
    } as NodeMatch);
    response.push({
      key: j,
      level,
      match: {
        teamAId: fm2[0].teamId,
        teamBId: fm2[1].teamId,
      },
    } as NodeMatch);
    i = i + iDir;
    j = j + jDir;
  }

  return response;
}
type NodeMatch = Omit<NodeMatchEntity, 'id' | 'tournamentId'>;
function convertToNodeMatch(level: number, flatMatches: TeamsInNucleon[][]): NodeMatch[] {
  return flatMatches.map((fm, index) => {
    return {
      key: index,
      level,
      match: {
        teamAId: fm[0].teamId,
        teamBId: fm[1].teamId,
      },
    } as NodeMatch;
  });
}

export function createTree(teamsIdentifiers: string[][]): NodeMatch[] {
  const fullPassedTeams = teamsIdentifiers.reduce((acc, team) => {
    return acc + team.length;
  }, 0);

  const ammountOfMatches = fullPassedTeams / 2;
  const maxLevelTree = Math.ceil(Math.log(ammountOfMatches) / Math.log(2));

  const initialNucleones = createNucleones(teamsIdentifiers);

  let sum = 0;

  let i = maxLevelTree;
  sum += Math.pow(2, i);

  i--;
  while (i > 0 && sum < ammountOfMatches) {
    sum += Math.pow(2, i);

    i--;
  }

  const flatMatches = generateFlatMatches({
    groupLength: teamsIdentifiers.length,
    matchesInMaxLevel: sum,
    nucleones: initialNucleones,
    totalMatches: ammountOfMatches,
    initialLevel: maxLevelTree,
  });

  return flatMatches;
}
