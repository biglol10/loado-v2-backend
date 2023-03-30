class CustomError extends Error {
  public data: any;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;

    // Set the prototype explicitly to maintain the instanceof check.
    // Note that if you're targeting modern JavaScript environments (such as ES6 or later), you might not need this line, as the prototype chain should be set up correctly by default
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
