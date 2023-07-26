export class RoleDoesNotExistException extends Error {
    constructor(email: string) {
      super();
      this.message = `The role with the id "${email}" does not exist.`;
      this.name = 'RoleDoesNotExistException';
    }
  }
  