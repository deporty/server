export class TeamAlreadyExistsException extends Error {
  constructor(property: string) {
    super();
    this.message = `The team with the property ${property} already exists.`;
    this.name = "TeamAlreadyExistsException";
  }
}
