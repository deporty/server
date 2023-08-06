export const GROUP_SIZES_PLACEHOLDERS = [];
export function createTeamIdentifiers(groupConfig: number[]) {
  const response = [];

  for (let i = 0; i < groupConfig.length; i++) {
    const ammount = groupConfig[i];
    const label = GROUP_SIZES_PLACEHOLDERS[i];

    const teamsIdentifiers = Array.from({ length: ammount }, (_, index) => label + (index + 1) + '');
    response.push(teamsIdentifiers);
  }
  return response;
}
export function isAvalidConfiguration(groupConfig: number[]) {
  return groupConfig.reduce((previousValue: boolean, currentValue: number) => {
    return previousValue && currentValue > 0;
  }, true);
}
export function isAvalidTree(matches: string[][]) {
  return matches.reduce((previousValue: boolean, currentValue: string[]) => {
    return (
      previousValue &&
      currentValue.reduce((previousValue1: boolean, currentValue1: string) => {
        return previousValue1 && !!currentValue1;
      }, true)
    );
  }, true);
}

export function _isEmpty(teamsIdentifiers: string[][]) {
  return teamsIdentifiers.reduce((previousValue: boolean, currentValue: string[]) => {
    return previousValue && currentValue.length == 0;
  }, true);
}
export function _createTree(index: number, teamsIdentifiers: string[][], response: string[][]) {
  if (_isEmpty(teamsIdentifiers)) {
    return;
  }
  const currentGroup = teamsIdentifiers[index];

  const nextIndex = index + 1 < teamsIdentifiers.length ? index + 1 : 0;
  const nextGroup = teamsIdentifiers[nextIndex];

  const A0Index = 0;
  const B1Index = nextGroup.length - 1;

  const A0: string = currentGroup.splice(A0Index, 1)[0];
  const B1: string = nextGroup.splice(B1Index, 1)[0];
  const info = [A0, B1];
  response.push(info);

  _createTree(nextIndex, teamsIdentifiers, response);
}

export function createTree(teamsIdentifiers: string[][]): string[][] | null {
  const response: string[][] = [];

  _createTree(0, teamsIdentifiers, response);

  return response;
}
