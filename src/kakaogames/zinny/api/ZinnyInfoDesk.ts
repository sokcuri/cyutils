import EndPoint from '../EndPoint';
import zinnyConfig from '../../../config/zinny.json';
import { ApiService } from '../ApiService';
import { ZinnyUnknownError } from '../Error';

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

function makeHeaders(obj: { [name: string]: string }): Headers {
  return {
    'User-Agent': obj['User-Agent']
  }
}

async function GetAppInfo(deviceId: string, whiteKey: string): Promise<Response> {
  const url = EndPoint.InfoDesk_App;
  const request = makeRequest({ ...zinnyConfig, deviceId, whiteKey });
  const headers = makeHeaders({ ...zinnyConfig });

  const response = await ApiService.Get<Request, Response, Headers>(url, request, headers);

  if (!response.status) {
    throw new ZinnyUnknownError(JSON.stringify(response));
  }
  return response;
}

export const ZinnyInfoDesk = {
  GetAppInfo,
};
