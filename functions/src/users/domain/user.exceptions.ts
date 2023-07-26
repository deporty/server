export class UserDoesNotExistException extends Error {
    constructor(property: string, email: string) {
      super();
      this.message = `The user with the ${property} "${email}" does not exist.`;
      this.name = 'UserDoesNotExistException';
    }
  }
  