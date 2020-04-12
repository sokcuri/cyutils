import * as error from '../error';

import fetch from 'node-fetch';
import EndPoint from '../endpoint';
import AdidInfo from '../adidinfo';

interface Request {
  appId: string;
  appVer: string;
  market: string;
  sdkVer: string;
  os: string;
  lang: string;
  deviceId?: string;
  osVer: string;
  country: string;
  whiteKey?: string;
}

interface Response {
  status: number;
  desc: string;
  content: {
    supportedFeatures: string[];
    marketUrl: string;
    capriAppOption: {
      ageLimit: number;
      lazyAgeAuth: boolean;
      appType: string;
      appCategory: string;
      ageAuthLevel: string;
    };
    verRecent: string;
    appOption: string;
    notices: string[];
    isWhitelist: boolean;
    svcStatus: string;
    supportedIdpCodes: string[];
    serverConnectionType: string;
    appVerStatus: string;
    publisher: {
      privacyUrl: string;
      privacySummaryUrl: string;
      noticeUrl2: string;
      agreementUrl: string;
      servicePolicyUrl: string;
      termsUrl: string;
      kakaogameCommunityUrl: string;
      termsSummaryUrl: string;
      eventWallUrl: string;
      noticeUrl: string;
      customerServiceUrl: string;
      eventWinnerUrl: string;
      policyVer: string;
      publisherId: string;
      modTime: number;
    };
    sdk: {
      heartbeatInterval: number;
      PercentOfSendingAPICallLog: number;
      session: string;
      snsShareUrl: string;
      cafeLoginUrl: string;
      snsShareHostUrl: string;
      invitationUrl: string;
      csUrl: string;
      platformVersion: number;
      sessionTimeout: number;
      snsShareGuestUrl: string;
    };
    onlineNotifications: string[];
    timestamp: number;
  };
}

interface Headers {
  'User-Agent': string;
}

function makeQueryString(endPoint: string, params: object): string {
  const queryString = Object.entries(params).map(([k, v]) => k + '=' + v).join('&');
  return queryString ? endPoint + '?' + queryString : endPoint;
}

function makeHeaders(obj: { [name: string]: string }): Headers {
  return {
    'User-Agent': obj['User-Agent']
  }
}

function makeRequest(obj: { [name: string]: string }): Request {
  return {
    appId: obj.appId,
    appVer: obj.appVer,
    market: obj.market,
    sdkVer: obj.sdkVer,
    os: obj.os,
    lang: obj.lang,
    deviceId: obj.udid,
    osVer: obj.osVer,
    country: obj.country,
    whiteKey: obj.adid
  }
}

async function GetAppInfo(config: Request, adidInfo: AdidInfo): Promise<Response> {
  const url = makeQueryString(EndPoint.InfoDesk_App, makeRequest({ ...config, ...adidInfo }));
  const headers = makeHeaders({ ...config });

  try {
    const resp = await fetch(url, { headers });
    const json = await resp.json();

    if (json.status !== 200) {
      throw new error.ZinnyInfoDesk.UnknownError(JSON.stringify(json));
    }

    return json;
  } catch (e) {
    if (e instanceof error.ZinnyError) {
      throw e;
    }
    if (e instanceof Error) {
      e = e as Error & { type: string };

      if (e.type === 'system') {
        throw new error.ZinnyInfoDesk.NotFoundError(JSON.stringify(e));
      } else if (e.type === 'invalid-json') {
        throw new error.ZinnyInfoDesk.InvalidJsonError(JSON.stringify(e));
      } else {
        throw new error.ZinnyInfoDesk.UnknownError(JSON.stringify(e));
      }
    }
  }
}

export const ZinnyInfoDesk = {
  GetAppInfo,
};
