export class PlayerAlreadyExistsException extends Error {
  constructor(property: string) {
    super();
    this.message = `The player with the property ${property} already exists.`;
    this.name = "PlayerAlreadyExistsException";
  }
}
