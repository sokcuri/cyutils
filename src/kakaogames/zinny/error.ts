export class ZinnyError extends Error {
  __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    this.__proto__ = trueProto;
  }
}

export namespace ZinnyInfoDesk {
  export class NotFoundError extends ZinnyError {
    constructor(message?: string) {
      super(message);
    }
  }

  export class InvalidJsonError extends ZinnyError {
    constructor(message?: string) {
      super(message);
    }
  }

  export class UnknownError extends ZinnyError {
    constructor(message?: string) {
      super(message);
    }
  }
}

export namespace ZinnyAccessToken {
  export class NotFoundError extends ZinnyError {
    constructor(message?: string) {
      super(message);
    }
  }

  export class InvalidJsonError extends ZinnyError {
    constructor(message?: string) {
      super(message);
    }
  }

  export class UnknownError extends ZinnyError {
    constructor(message?: string) {
      super(message);
    }
  }
}
