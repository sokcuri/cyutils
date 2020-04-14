export class ZinnyError extends Error {
  __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    this.__proto__ = trueProto;
  }
}

export class ZinnyNotFoundError extends ZinnyError {
  constructor(message?: string) {
    super(message);
  }
}

export class ZinnyInvalidJsonError extends ZinnyError {
  constructor(message?: string) {
    super(message);
  }
}

export class ZinnyUnknownError extends ZinnyError {
  constructor(message?: string) {
    super(message);
  }
}

export class ZinnySessionUnknownError extends ZinnyError {
  constructor(message?: string) {
    super(message);
  }
}

export class ZinnySessionMismatchCommand extends ZinnyError {
  constructor(message?: string) {
    super(message);
  }
}
