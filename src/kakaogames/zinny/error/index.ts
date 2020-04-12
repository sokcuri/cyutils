export class ZinnyError extends Error {
  __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    this.__proto__ = trueProto;
  }
}

export * as ZinnyInfoDesk from './ZinnyInfoDesk';
export * as ZinnyAccessToken from './ZinnyAccessToken';
