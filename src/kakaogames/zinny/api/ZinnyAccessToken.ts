import EndPoint from '../EndPoint';
import zinnyConfig from '../../../config/zinny.json';
import { ApiService } from '../ApiService';
import { ZinnyUnknownError } from '../Error';

interface Request {
  appVer: string;
  sdkVer: string;
  os: string;
  market: string;
  deviceId?: string;
  serialNo?: string;
  previousDeviceId?: string;
  previousSerialNo?: string;
}

interface Response {
  expiryTime: number;
  accessToken: string;
}

interface Headers {
  'appId': string;
  'appSecret': string;
  'requestedBy': string;
  'Content-Type': string;
  'User-Agent': string;
}

function makeRequest(obj: { [name: string]: string }): Request {
  return {
    appVer: obj.appVer,
    sdkVer: obj.sdkVer,
    os: obj.os,
    market: obj.market,
    deviceId: obj.deviceId,
    serialNo: obj.os,
    previousDeviceId: obj.deviceId,
    previousSerialNo: obj.os
  }
}

function makeHeaders(obj: { [name: string]: string }): Headers {
  return {
    'appId': obj.appId,
    'appSecret': obj.appSecret,
    'requestedBy': obj.os,
    'User-Agent': obj['User-Agent'],
    'Content-Type': obj['Content-Type']
  }
}

async function CreateWithPreviousInfo(deviceId: string): Promise<Response> {
  const url = EndPoint.AccessToken_CreateWithPreviousInfo;
  const request = makeRequest({ ...zinnyConfig, deviceId });
  const headers = makeHeaders({ ...zinnyConfig, 'Content-Type': 'application/json;charset=UTF-8' });

  const response = await ApiService.Post<Request, Response, Headers>(url, request, headers);

  if (!response.expiryTime) {
    throw new ZinnyUnknownError(JSON.stringify(response));
  }
  return response;
}

export const ZinnyAccessToken = {
  CreateWithPreviousInfo,
};
