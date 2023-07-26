export class PlayerDoesNotExistError extends Error {
  constructor(id: string) {
    super(`The player with the id ${id} does not exist.`);
    this.name = 'PlayerDoesNotExistError';
  }
}
