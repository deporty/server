export class TeamDoesNotExistError extends Error {
  constructor(id: string) {
    super(`The team with the id ${id} does not exist`);
    this.name = 'TeamDoesNotExistError';
  }
}
