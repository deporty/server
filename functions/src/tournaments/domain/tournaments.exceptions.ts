import { MatchEntity } from '@deporty-org/entities/tournaments';

export class MatchWasAlreadyRegistered extends Error {
  constructor(match: MatchEntity) {
    super();
    this.message = `The match with "${match.teamAId}" and "${match.teamBId}" was already registered`;
    this.name = 'MatchWasAlreadyRegistered';
  }
}

export class StageDoesNotExist extends Error {
  constructor(stageIndex: string) {
    super();
    this.message = `The stage with the id "${stageIndex}" does not exist`;
    this.name = 'StageDoesNotExist';
  }
}

export class GroupDoesNotExist extends Error {
  constructor(value: string, property = 'id') {
    super();
    this.message = `The group with the ${property} "${value}" does not exist.`;
    this.name = 'GroupDoesNotExist';
  }
}


export class GroupAlreadyExistsError extends Error {
  constructor(value: string, property = 'id') {
    super();
    this.message = `The group with the ${property} "${value}" already exists.`;
    this.name = 'GroupAlreadyExistsError';
  }
}
export class LabelMustBeProvidedError extends Error {
  constructor() {
    super();
    this.message = `The label was not provided.`;
    this.name = 'LabelMustBeProvidedError';
  }
}
export class OrderMustBeProvidedError extends Error {
  constructor() {
    super();
    this.message = `The order was not provided.`;
    this.name = 'OrderMustBeProvidedError';
  }
}


export class TeamIsAlreadyInTheGroup extends Error {
  constructor(name: string) {
    super();
    this.message = `The team "${name}" is already in the group`;
    this.name = 'TeamIsAlreadyInTheGroup';
  }
}

export class TeamIsAlreadyInOtherGroup extends Error {
  constructor(name: string) {
    super();
    this.message = `The team "${name}" is already in other group`;
    this.name = 'TeamIsAlreadyInOtherGroup';
  }
}

export class TeamDoesNotHaveMembers extends Error {
  constructor(name: string) {
    super();
    this.message = `The team "${name}" does not have members. Add at least one member.`;
    this.name = 'TeamDoesNotHaveMembers';
  }
}

export class TeamWasAlreadyRegistered extends Error {
  constructor(name: string) {
    super();
    this.message = `The team "${name}" was already registered`;
    this.name = 'TeamWasAlreadyRegistered';
  }
}

export class MatchDoesNotExist extends Error {
  constructor() {
    super();
    this.message = `The match does not exist.`;
    this.name = 'MatchDoesNotExist';
  }
}

export class TournamentDoesNotExistError extends Error {
  constructor(id: string) {
    super();
    this.message = `The tournament with the id ${id} does not exist`;
    this.name = 'TournamentDoesNotExistError';
  }
}
