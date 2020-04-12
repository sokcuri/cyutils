export interface ZinnyURLParams {
  appId: string;
  appVer: string;
  market: string;
  sdkVer: string;
  os: string;
  lang: string;
  deviceId: string;
  osVer: string;
  country: string;
  whiteKey: string;
}

export interface ZinnyTokenBody {
  appVer: string;
  sdkVer: string;
  os: string;
  market: string;
  deviceId: string;
  serialNo: string;
  previousDeviceId: string;
  previousSerialNo: string;
}

export interface ZinnyTokenHeader {
  appId: string;
  appSecret: string;
  requestedBy: string;
}

export interface ZinnyLoginParams {
  idpId: string;
  accessToken: string;
  loginType: string;
  resume: boolean;
  fields: string[];
  retryNo: number;
  appId: string;
  appSecret: string;
  appVer: string;
  market: string;
  country: string;
  lang: string;
  sdkVer: string;
  telecom: string;
  deviceModel: string;
  os: string;
  osVer: string;
  network: string;
  deviceId: string;
  clientTime: number;
  timezoneOffset: number;
  adid: string;
  whiteKey: string;
  gsiToken: boolean;
  serialNo: string;
  referrer: string;
}
