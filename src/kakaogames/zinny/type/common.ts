export interface DeviceStatus {
  ip: string;
  country: string;
  lang: string;
  locale: string;
  telecom: string;
  network: string;
}

export interface AppSecret {
  appId: string;
  appSecret: string;
}

export interface AppInfo {
  appVer: string;
  sdkVer: string;
}

export interface SysInfo {
  os: string;
  osVer: string;
  platformOsVer: string;
  market: string;
}

export interface IDPInfo {
  idpId: string;
}

export interface ADIDInfo {
  adid: string;
  whiteKey: string;
}

export interface TimeInfo {
  clientTime: number;
  timezoneOffset: number;
}

export interface DeviceInfo {
  deviceId: string;
  serialNo: string;
}

export interface EnvInfo {
  deviceName: string;
  deviceModel: string;
  graphicDeviceName: string;
  requestedBy: string;
  userAgent: string;
}
