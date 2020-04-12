// import * as I from './interface';

// import {
//   ZinnyTokenBody,
//   ZinnyTokenHeader,
//   ZinnyLoginParams
// } from './interface';

// import C from '../../config.json';

// export function getAccessTokenBody(): ZinnyTokenBody {
//   return {
//     appVer: C.appVer,
//     sdkVer: C.sdkVer,
//     os: C.os,
//     market: C.market,
//     deviceId: C.udid,
//     serialNo: C.os,
//     previousDeviceId: C.udid,
//     previousSerialNo: C.os
//   }
// }

// export function getAccessTokenHeader(): ZinnyTokenHeader {
//   return {
//     appId: C.appId,
//     appSecret: C.appSecret,
//     requestedBy: C.os
//   }
// }

// export function getLoginObject(accessToken: string): ZinnyLoginParams {
//   return {
//     idpId: C.udid,
//     accessToken,
//     loginType: 'manual',
//     resume: false,
//     fields: [
//       'playerId',
//       'customProperty',
//       'secureProperty',
//       'pushToken',
//       'pushOption',
//       'agreement',
//       'memberKey',
//       'lang',
//       'regTime'
//     ],
//     retryNo: 0,
//     appId: C.appId,
//     appSecret: C.appSecret,
//     appVer: C.appVer,
//     market: C.market,
//     country: C.country,
//     lang: C.lang,
//     sdkVer: C.sdkVer,
//     telecom: C.telecom,
//     deviceModel: C.deviceModel,
//     os: C.os,
//     osVer: C.osVer,
//     network: C.network,
//     deviceId: C.udid,
//     clientTime: Date.now(),
//     timezoneOffset: -18000000,
//     adid: C.adid,
//     whiteKey: C.adid,
//     gsiToken: true,
//     serialNo: C.os,
//     referrer: 'utm_source=google-play&utm_medium=organic'
//   }
// }

