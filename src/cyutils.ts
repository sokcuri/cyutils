/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/camelcase */
import * as Kakaogames from './kakaogames';
import * as Priconne from './priconne';
import Auth from './priconne/Auth';

export enum ErrorCode {
  Success,
  ZinnyInfoDesk_StatusNotOK,
  ZinnyInfoDesk_AppVerStatus_NeedUpdate,
  ZinnyInfoDesk_ServiceNotOpened,
  ZinnyInfoDesk_NotFoundError,
  ZinnyInfoDesk_InvalidJsonError,
  ZinnyInfoDesk_UnknownError,
  ZinnyAccessToken_NotFoundError,
  ZinnyAccessToken_InvalidJsonError,
  ZinnyAccessToken_UnknownError,
  ZinnySession_Login_MismatchCommandError,
  ZinnySession_Login_UnknownError,
  ZinnySession_SetPlayerAgreement_MismatchCommandError,
  ZinnySession_SetPlayerAgreement_UnknownError,
  ZinnySession_GetLocalPlayer_MismatchCommandError,
  ZinnySession_GetLocalPlayer_UnknownError,
  Priconne_Tool_Signup2_NotFoundError,
  Priconne_Tool_Signup2_ResultNotOK,
  Priconne_Tool_Signup2_ZatFailedError,
  Priconne_Tool_Signup2_UnknownError,
  Priconne_Tool_Signup2_InvalidJsonError,
  Priconne_Tool_KakaoDropoutCancel_NotFoundError,
  Priconne_Tool_KakaoDropoutCancel_ResultNotOK,
  Priconne_Tool_KakaoDropoutCancel_ZatFalseError,
  Priconne_Tool_KakaoDropoutCancel_InvalidJsonError,
  Priconne_Tool_KakaoDropoutCancel_UnknownError,
  Priconne_Tool_KakaoDropoutCancel_ZatFailedError,
  Priconne_Load_Index_NotFoundError,
  Priconne_Load_Index_InvalidJsonError,
  Priconne_Load_Index_ResultNotOK,
  Priconne_Load_Index_UnknownError,
  Priconne_Home_Index_NotFoundError,
  Priconne_Home_Index_InvalidJsonError,
  Priconne_Home_Index_ResultNotOK,
  Priconne_Home_Index_UnknownError
}

export class CyUtils {
  private logged: boolean;
  private auth: Auth;
  private deviceId: string;
  private whiteKey: string;

  constructor(deviceId: string, whiteKey: string) {
    this.logged = false;
    this.deviceId = deviceId;
    this.whiteKey = whiteKey;
  }

  public async login() {
    const { deviceId, whiteKey } = this;

    let accessToken: string;
    let playerId: string;
    let zat: string;
    let zatExpiryTime: number;

    try {
      const appInfo = await Kakaogames.ZinnyInfoDesk.GetAppInfo(deviceId, whiteKey);
      if (appInfo.status !== 200) {
        return ErrorCode.ZinnyInfoDesk_StatusNotOK;
      }
      if (appInfo.content.appVerStatus !== 'noNeedToUpdate') {
        return ErrorCode.ZinnyInfoDesk_AppVerStatus_NeedUpdate;
      }
      if (appInfo.content.svcStatus !== 'open') {
        return ErrorCode.ZinnyInfoDesk_ServiceNotOpened;
      }
    } catch (e) {
      if (e instanceof Kakaogames.ZinnyNotFoundError) {
        return ErrorCode.ZinnyInfoDesk_NotFoundError;
      } else if (e instanceof Kakaogames.ZinnyInvalidJsonError) {
        return ErrorCode.ZinnyInfoDesk_InvalidJsonError;
      } else if (e instanceof Kakaogames.ZinnyUnknownError) {
        return ErrorCode.ZinnyInfoDesk_UnknownError;
      }
    }

    try {
      const tokenInfo = await Kakaogames.ZinnyAccessToken.CreateWithPreviousInfo(deviceId);
      accessToken = tokenInfo.accessToken;
    } catch (e) {
      if (e instanceof Kakaogames.ZinnyNotFoundError) {
        return ErrorCode.ZinnyAccessToken_NotFoundError;
      } else if (e instanceof Kakaogames.ZinnyInvalidJsonError) {
        return ErrorCode.ZinnyAccessToken_InvalidJsonError;
      } else if (e instanceof Kakaogames.ZinnyUnknownError) {
        return ErrorCode.ZinnyAccessToken_UnknownError;
      }
    }

    const session = new Kakaogames.SessionService();

    try {
      const loginRes = await session.login(accessToken, deviceId, whiteKey);
      playerId = loginRes[2].content.player.playerId;
      zat = loginRes[2].content.zat;
      zatExpiryTime = loginRes[2].content.zatExpiryTime;
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return ErrorCode.ZinnySession_Login_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return ErrorCode.ZinnySession_Login_UnknownError;
      }
    }

    try {
      await session.setPlayerAgreement(playerId);
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return ErrorCode.ZinnySession_SetPlayerAgreement_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return ErrorCode.ZinnySession_SetPlayerAgreement_UnknownError;
      }
    }

    try {
      await session.getLocalPlayer(playerId);
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return ErrorCode.ZinnySession_GetLocalPlayer_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return ErrorCode.ZinnySession_GetLocalPlayer_UnknownError;
      }
    }

    session.close();

    this.auth = new Auth(this.deviceId, playerId, zatExpiryTime, zat);

    try {
      await Priconne.Tool.Signup2(this.auth);
    } catch (e) {
      if (e instanceof Priconne.PcrNotFoundError) {
        return ErrorCode.Priconne_Tool_Signup2_NotFoundError;
      } else if (e instanceof Priconne.PcrInvalidJsonError) {
        return ErrorCode.Priconne_Tool_Signup2_InvalidJsonError;
      } else if (e instanceof Priconne.PcrResultNotOkError) {
        return ErrorCode.Priconne_Tool_Signup2_ResultNotOK;
      } else if (e instanceof Priconne.PcrZatFailedError) {
        return ErrorCode.Priconne_Tool_Signup2_ZatFailedError;
      } else {
        return ErrorCode.Priconne_Tool_Signup2_UnknownError;
      }
    }

    try {
      await Priconne.Tool.KakaoDropoutCancel(this.auth);
    } catch (e) {
      if (e instanceof Priconne.PcrNotFoundError) {
        return ErrorCode.Priconne_Tool_KakaoDropoutCancel_NotFoundError;
      } else if (e instanceof Priconne.PcrInvalidJsonError) {
        return ErrorCode.Priconne_Tool_KakaoDropoutCancel_InvalidJsonError;
      } else if (e instanceof Priconne.PcrResultNotOkError) {
        return ErrorCode.Priconne_Tool_KakaoDropoutCancel_ResultNotOK;
      } else if (e instanceof Priconne.PcrZatFailedError) {
        return ErrorCode.Priconne_Tool_KakaoDropoutCancel_ZatFailedError;
      } else {
        return ErrorCode.Priconne_Tool_KakaoDropoutCancel_UnknownError;
      }
    }

    try {
      await Priconne.Load.Index(this.auth);
    } catch (e) {
      if (e instanceof Priconne.PcrNotFoundError) {
        return ErrorCode.Priconne_Load_Index_NotFoundError;
      } else if (e instanceof Priconne.PcrInvalidJsonError) {
        return ErrorCode.Priconne_Load_Index_InvalidJsonError;
      } else if (e instanceof Priconne.PcrResultNotOkError) {
        return ErrorCode.Priconne_Load_Index_ResultNotOK;
      } else {
        return ErrorCode.Priconne_Load_Index_UnknownError;
      }
    }

    try {
      await Priconne.Home.Index(this.auth);
    } catch (e) {
      if (e instanceof Priconne.PcrNotFoundError) {
        return ErrorCode.Priconne_Home_Index_NotFoundError;
      } else if (e instanceof Priconne.PcrInvalidJsonError) {
        return ErrorCode.Priconne_Home_Index_InvalidJsonError;
      } else if (e instanceof Priconne.PcrResultNotOkError) {
        return ErrorCode.Priconne_Home_Index_ResultNotOK;
      } else {
        return ErrorCode.Priconne_Home_Index_UnknownError;
      }
    }

    this.logged = true;
    return ErrorCode.Success;
  }

  public async logout(): Promise<void> {
    // Logout
    return;
  }

  public async getClanInfo(clanId: number) {
    return await Priconne.Clan.OthersInfo(this.auth, clanId);
  }

  public async getProfile(targetId: number) {
    return await Priconne.Profile.GetProfile(this.auth, targetId);
  }
}
