import {
  ZinnySessionUnknownError,
  ZinnySessionMismatchCommand
} from './Error';

import zinnyConfig from '../../config/zinny.json';

import Base64 from './Base64';
import websocket from 'ws';

import util from 'util';
import zlib from 'zlib';


export interface TxNo {
  txNo: number;
}

type StringMap = { [name: string]: string };

export type SessionEndPoint = string;

export type SessionStruct = [SessionEndPoint, TxNo, object];

export interface SessionData {
  market: string;
  country: string;
  txNo: number;
  clientIp: string;
  appId: string;
  sessionId: string;
  lang: string;
  qid: number;
  playerId: string;
}

export interface LoginRequest {
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

export type LoginResponse = [SessionEndPoint, SessionData, LoginResponseDetail];

export interface LoginResponseDetail {
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
    };
  };
}

export interface PlayerAgreementRequest {
  appId: string;
  playerId: string;
  addPlusFriendsIds: string[];
  joinMembership: boolean;
  agreement: {
    E001: string;
    E002: string;
    N002: string;
    N003: string;
  };
}

export type PlayerAgreementResponse = [SessionEndPoint, SessionData, PlayerAgreementDetail];

export interface PlayerAgreementDetail {
  status: number;
  desc: string;
  content: {};
}

export interface LocalPlayerRequest {
  appId: string;
  playerId: string;
  fields: string[];
}

export type LocalPlayerResponse = [SessionEndPoint, SessionData, LocalPlayerDetail];

export interface LocalPlayerDetail {
  status: number;
  desc: string;
  content: {
    player: {
      agreement: {
        E001: string;
        E002: string;
        N002: string;
        N003: string;
      };
      appId: string;
      appStatus: string;
      customProperty: unknown;
      lang: string;
      memberKey: unknown;
      playerId: string;
      pushToken: string;
      regTime: number;
    };
  };
}

function makeLoginRequest(obj: StringMap): LoginRequest {
  return {
    idpId: obj.udid,
    accessToken: obj.accessToken,
    loginType: 'manual',
    resume: false,
    fields: [
      'playerId',
      'customProperty',
      'secureProperty',
      'pushToken',
      'pushOption',
      'agreement',
      'memberKey',
      'lang',
      'regTime'
    ],
    retryNo: 0,
    appId: obj.appId,
    appSecret: obj.appSecret,
    appVer: obj.appVer,
    market: obj.market,
    country: obj.country,
    lang: obj.lang,
    sdkVer: obj.sdkVer,
    telecom: obj.telecom,
    deviceModel: obj.deviceModel,
    os: obj.os,
    osVer: obj.osVer,
    network: obj.network,
    deviceId: obj.deviceId,
    clientTime: Date.now(),
    timezoneOffset: -18000000,
    adid: obj.adid,
    whiteKey: obj.whiteKey,
    gsiToken: true,
    serialNo: obj.os,
    referrer: 'utm_source=google-play&utm_medium=organic'
  }
}

export function makePlayerAgreementRequest(obj: StringMap): PlayerAgreementRequest {
  return {
    appId: obj.appId,
    playerId: obj.playerId,
    addPlusFriendsIds: [],
    joinMembership: false,
    agreement: {
      E001: 'y',
      E002: 'y',
      N002: 'n',
      N003: 'n'
    }
  }
}

export function makeLocalPlayerRequest(obj: StringMap): LocalPlayerRequest {
  return {
    appId: obj.appId,
    playerId: obj.playerId,
    fields: [
      'playerId',
      'customProperty',
      'secureProperty',
      'pushToken',
      'pushOptions',
      'agreement',
      'memberKey',
      'lang',
      'regTime'
    ]
  }
}

function parseResponse<T>(data: string): T {
  let resp: T;

  try {
    resp = JSON.parse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
  return resp;
}

function random(low: number, high: number): number {
  return Math.round(Math.random() * (high - low) + low);
}

function makeTxNo(): TxNo {
  return {
    txNo: random(-2147483648, 2147483647),
  }
}

function wrapRequest(command: string, request: object): SessionStruct {
  return [command, makeTxNo(), request];
}

export class SessionService {
  private ws: websocket;

  public async login(accessToken: string, deviceId: string, whiteKey: string): Promise<LoginResponse> {
    const command = 'auth://v3/auth/loginZinnyDevice3';
    const request = makeLoginRequest({ ...zinnyConfig, deviceId, whiteKey, accessToken });
    const wrapped = wrapRequest(command, request);
    const deflated = zlib.deflateSync(JSON.stringify(wrapped))
    const encoded = Base64.UrlSafeEncode(deflated);
    const url = util.format('wss://session-zinny3.game.kakao.com/session?zipped=deflate&prereq=%s', encoded);

    this.ws = new websocket(url);

    return new Promise((resolve, reject) => {
      this.ws.once('message', (data: string) => {
        const resp = parseResponse<LoginResponse>(data);

        if (resp[0] !== command) {
          reject(new ZinnySessionMismatchCommand(data));
        } else if (resp[2].status !== 200) {
          reject(new ZinnySessionUnknownError(data));
        } else {
          resolve(resp);
        }
      });
    });
  }

  public setPlayerAgreement(playerId: string): Promise<PlayerAgreementResponse> {
    const command = 'inhousegw://v3/player/agreement/set';
    const request = makePlayerAgreementRequest({ ...zinnyConfig, playerId });
    const wrapped = wrapRequest(command, request);

    this.ws.send(JSON.stringify(wrapped));

    return new Promise((resolve, reject) => {
      this.ws.once('message', (data: string) => {
        const resp = parseResponse<PlayerAgreementResponse>(data);

        if (resp[0] !== command) {
          reject(new ZinnySessionMismatchCommand(data));
        }
        else if (resp[2].status !== 200) {
          reject(new ZinnySessionUnknownError(data));
        }
        else {
          resolve(resp);
        }
      });
    });
  }

  public async getLocalPlayer(playerId: string): Promise<LocalPlayerResponse> {
    const command = 'profile://v2/player/getLocal';
    const request = makeLocalPlayerRequest({ ...zinnyConfig, playerId });
    const wrapped = wrapRequest(command, request);

    this.ws.send(JSON.stringify(wrapped));

    return new Promise((resolve, reject) => {
      this.ws.once('message', (data: string) => {
        const resp = parseResponse<LocalPlayerResponse>(data);

        if (resp[0] !== command) {
          reject(new ZinnySessionMismatchCommand(data));
        } else if (resp[2].status !== 200) {
          reject(new ZinnySessionUnknownError(data));
        } else {
          resolve(resp);
        }
      });
    });
  }

  public close(): void {
    this.ws.close();
  }
}
