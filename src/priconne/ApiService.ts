import fetch from 'node-fetch';
import {
  PcrError,
  PcrUnknownError,
  PcrNotFoundError,
  PcrInvalidJsonError
} from './Error';

import pcrConfig from '../config/pcr.json';
import Auth from './Auth';

interface ApiRequestHeaderInternal {
  'KEYCHAIN': string;
  'SHORT-UDID': number;
  'BATTLE-LOGIC-VERSION': number;
  'REGION-CODE': string;
  'PLATFORM': number;
  'IP-ADDRESS': string;
  'DEVICE-ID': string;
  'LOCALE': string;
  'PLATFORM-OS-VERSION': string;
  'X-Unity-Version': string;
  'DEVICE-NAME': string;
  'Content-Type': string;
  'GRAPHICS-DEVICE-NAME': string;
  'BUNDLE-VER': string;
  'APP-VER': string;
  'DEVICE': number;
  'RES-VER': string;
  'User-Agent': string;
}

export interface ApiRequestHeaderBase extends ApiRequestHeaderInternal {
  'PARAM': string;
  'SID': string;
}

export interface ApiResponseBase {
  data_headers: {
    udid: string;
    short_udid: number;
    viewer_id: number;
    sid: string;
    servertime: number;
    result_code: number;
  };
}

export class ApiService {
  private static MakeRequestHeader(auth: Auth): ApiRequestHeaderInternal {
    return {
      'KEYCHAIN': pcrConfig['KEYCHAIN'],
      'SHORT-UDID': auth.shortUDID,
      'BATTLE-LOGIC-VERSION': pcrConfig['BATTLE-LOGIC-VERSION'],
      'REGION-CODE': pcrConfig['REGION-CODE'],
      'PLATFORM': pcrConfig['PLATFORM'],

      'IP-ADDRESS': pcrConfig['IP-ADDRESS'],
      'DEVICE-ID': pcrConfig['DEVICE-ID'],
      'LOCALE': pcrConfig['LOCALE'],
      'PLATFORM-OS-VERSION': pcrConfig['PLATFORM-OS-VERSION'],

      'X-Unity-Version': pcrConfig['X-Unity-Version'],
      'DEVICE-NAME': pcrConfig['DEVICE-NAME'],
      'Content-Type': 'application/x-www-form-urlencoded',

      'GRAPHICS-DEVICE-NAME': pcrConfig['GRAPHICS-DEVICE-NAME'],
      'BUNDLE-VER': pcrConfig['BUNDLE-VER'],

      'APP-VER': pcrConfig['APP-VER'],
      'DEVICE': pcrConfig['DEVICE'],
      'RES-VER': pcrConfig['RES-VER'],

      'User-Agent': pcrConfig['User-Agent'],
    };
  }

  public static async Post<TReq extends object, TResp extends object, THead extends object>
  (url: string, req: TReq, headers: THead, auth: Auth): Promise<TResp & ApiResponseBase> {
    headers = { ...this.MakeRequestHeader(auth), ...headers };
    return await this.Fetch(url, { method: 'POST', body: JSON.stringify(req), headers });
  }

  public static async Fetch<TResp>(...args: unknown[]): Promise<TResp & ApiResponseBase> {
    try {
      const resp = await fetch(...args);
      const json = await resp.json();
      return json;
    } catch (e) {
      if (e instanceof PcrError) {
        throw e;
      }
      if (e instanceof Error) {
        e = e as Error & { type: string };

        if (e.type === 'system') {
          throw new PcrNotFoundError(JSON.stringify(e));
        } else if (e.type === 'invalid-json') {
          throw new PcrInvalidJsonError(JSON.stringify(e));
        } else {
          throw new PcrUnknownError(JSON.stringify(e));
        }
      }
    }
  }
}
