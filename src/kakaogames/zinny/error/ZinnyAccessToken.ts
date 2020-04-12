import { ZinnyError } from '.';

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
