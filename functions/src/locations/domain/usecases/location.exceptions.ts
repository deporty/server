export class LocationDoesNotExistError extends Error {
    constructor(id: string) {
      super();
      this.message = `The location with the id ${id} does not exist`;
      this.name = 'LocationDoesNotExistError';
    }
  }