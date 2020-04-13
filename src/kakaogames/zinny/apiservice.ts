import fetch from 'node-fetch';
import {
  ZinnyError,
  ZinnyUnknownError,
  ZinnyNotFoundError,
  ZinnyInvalidJsonError
} from './Error';

export class ApiService {
  private static makeQueryString(endPoint: string, params: object): string {
    const queryString = Object.entries(params).map(([k, v]) => k + '=' + v).join('&');
    return queryString ? endPoint + '?' + queryString : endPoint;
  }

  public static async Get<TReq extends object, TResp extends object, THead extends object>
  (url: string, req: TReq, headers: THead): Promise<TResp> {
    return await this.Fetch(this.makeQueryString(url, req), { headers });
  }

  public static async Post<TReq extends object, TResp extends object, THead extends object>
  (url: string, req: TReq, headers: THead): Promise<TResp> {
    return await this.Fetch(url, { method: 'POST', body: JSON.stringify(req), headers });
  }

  public static async Fetch<TResp>(...args: unknown[]): Promise<TResp> {
    try {
      const resp = await fetch(...args);
      const json = await resp.json();
      return json;
    } catch (e) {
      if (e instanceof ZinnyError) {
        throw e;
      }
      if (e instanceof Error) {
        e = e as Error & { type: string };

        if (e.type === 'system') {
          throw new ZinnyNotFoundError(JSON.stringify(e));
        } else if (e.type === 'invalid-json') {
          throw new ZinnyInvalidJsonError(JSON.stringify(e));
        } else {
          throw new ZinnyUnknownError(JSON.stringify(e));
        }
      }
    }
  }
}
