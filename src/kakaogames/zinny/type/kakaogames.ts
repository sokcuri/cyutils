import * as Common from './common';

export interface TransactionNumber {
  txNo: number;
}

export interface ZinnyInfoDesk {
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
    }
    verRecent: string;
    appOption: any;
    notices: any[];
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
    }
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
    }
    onlineNotifications: any[];
    timestamp: number;
  }
}

export interface LoginInfo {
  loginType: 'manual';
  resume: boolean;
  fields: ['playerId', 'customProperty', 'secureProperty', 'pushToken', 'pushOption', 'agreement', 'memberKey', 'lang', 'regTime'];
  retryNo: number;
  gsiToken: true;
  referrer: 'utm_source=google-play&utm_medium=organic';
}

export interface ZinnyCommonError {
  desc: string;
}

export interface PreviousDeviceInfo {
  previousDeviceId: string;
  previousSerialNo: string;
}

export interface AccessTokenInfo {
  expiryTime?: number;
  accessToken: string;
}

export interface AccessTokenReq {
  appInfo: Common.AppInfo;
  appSecret: Common.AppSecret;
  envInfo: Common.EnvInfo;
  sysInfo: Common.SysInfo;
  deviceInfo: Common.DeviceInfo;
  previousDeviceInfo: PreviousDeviceInfo;
}

export type AccessTokenResp = AccessTokenInfo | ZinnyCommonError;

export interface ZinnyLoginReq {
  appInfo: Common.AppInfo;
  appSecret: Common.AppSecret;
  token: AccessTokenInfo;
  deviceStatus: Common.DeviceStatus;
  envInfo: Common.EnvInfo;
  idpInfo: Common.IDPInfo;
  adidInfo: Common.ADIDInfo;
  sysInfo: Common.SysInfo;
  timeInfo: Common.TimeInfo;
  loginInfo: LoginInfo;
  deviceInfo: Common.DeviceInfo;
}

export interface ZinnyLoginResp {
  endpoint: string;
  data: {
    market: string;
    country: string;
    txNo: number;
    clientIp: string;
    appId: string;
    sessionId: string;
    lang: string;
    qid: number;
    playerId: string;
  },
  detail: {
    status: number;
    desc: string;
    content: {
      zatExpiryTime: number;
      firstLogin: boolean;
      zat: string;
      player: {
        idpId: string;
        appId: string;
        playerId: string;
        idpCode: string;
        regTime: number;
        idpAlias: string;
        firstLoginTime: number;
        status: string;
      }
    }
  }
}
