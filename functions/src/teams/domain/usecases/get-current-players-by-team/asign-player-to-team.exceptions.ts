export class PlayerIsAlreadyInTeamException extends Error {
  constructor(property: string) {
    super();
    this.message = `The player with the document ${property} already exists in the team`;
    this.name = 'PlayerIsAlreadyInTeam';
  }
}
