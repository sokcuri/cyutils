export class PcrError extends Error {
  __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    this.__proto__ = trueProto;
  }
}

export class PcrNotFoundError extends PcrError {
  constructor(message?: string) {
    super(message);
  }
}

export class PcrInvalidJsonError extends PcrError {
  constructor(message?: string) {
    super(message);
  }
}

export class PcrZatFailedError extends PcrError {
  constructor(message?: string) {
    super(message);
  }
}

export class PcrResultNotOkError extends PcrError {
  constructor(message?: string) {
    super(message);
  }
}

export class PcrUnknownError extends PcrError {
  constructor(message?: string) {
    super(message);
  }
}
