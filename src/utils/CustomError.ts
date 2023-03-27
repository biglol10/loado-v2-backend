class CustomError extends Error {
  public data: any;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;

    // Set the prototype explicitly to maintain the instanceof check.
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
