export class EmptyStringException extends Error {
    constructor(property: string) {
      super();
      this.message = `The ${property} is empty.`;
      this.name = "EmptyStringException";
    }
}
export class EmptyAttributeError extends Error {
    constructor(property: string) {
      super();
      this.message = `The ${property} attribute is empty.`;
      this.name = "EmptyAttributeError";
    }
}

  export class VariableNotDefinedException extends Error {
    constructor(property: string) {
      super();
      this.message = `The ${property} is not defined.`;
      this.name = "VariableNotDefinedException";
    }
}
