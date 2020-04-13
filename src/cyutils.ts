/* eslint-disable @typescript-eslint/camelcase */
import * as Kakaogames from './kakaogames';
import * as Priconne from './priconne';
import Auth from './priconne/Auth';

export enum LoginCode {
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

  public async login(): Promise<LoginCode> {
    const { deviceId, whiteKey } = this;

    let accessToken: string;
    let playerId: string;
    let zat: string;
    let zatExpiryTime: number;

    try {
      const appInfo = await Kakaogames.ZinnyInfoDesk.GetAppInfo(deviceId, whiteKey);
      if (appInfo.status !== 200) {
        return LoginCode.ZinnyInfoDesk_StatusNotOK;
      }
      if (appInfo.content.appVerStatus !== 'noNeedToUpdate') {
        return LoginCode.ZinnyInfoDesk_AppVerStatus_NeedUpdate;
      }
      if (appInfo.content.svcStatus !== 'open') {
        return LoginCode.ZinnyInfoDesk_ServiceNotOpened;
      }
    } catch (e) {
      if (e instanceof Kakaogames.ZinnyNotFoundError) {
        return LoginCode.ZinnyInfoDesk_NotFoundError;
      } else if (e instanceof Kakaogames.ZinnyInvalidJsonError) {
        return LoginCode.ZinnyInfoDesk_InvalidJsonError;
      } else if (e instanceof Kakaogames.ZinnyUnknownError) {
        return LoginCode.ZinnyInfoDesk_UnknownError;
      }
    }

    try {
      const tokenInfo = await Kakaogames.ZinnyAccessToken.CreateWithPreviousInfo(deviceId);
      accessToken = tokenInfo.accessToken;
    } catch (e) {
      if (e instanceof Kakaogames.ZinnyNotFoundError) {
        return LoginCode.ZinnyAccessToken_NotFoundError;
      } else if (e instanceof Kakaogames.ZinnyInvalidJsonError) {
        return LoginCode.ZinnyAccessToken_InvalidJsonError;
      } else if (e instanceof Kakaogames.ZinnyUnknownError) {
        return LoginCode.ZinnyAccessToken_UnknownError;
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
        return LoginCode.ZinnySession_Login_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return LoginCode.ZinnySession_Login_UnknownError;
      }
    }

    try {
      await session.setPlayerAgreement(playerId);
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return LoginCode.ZinnySession_SetPlayerAgreement_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return LoginCode.ZinnySession_SetPlayerAgreement_UnknownError;
      }
    }

    try {
      await session.getLocalPlayer(playerId);
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return LoginCode.ZinnySession_GetLocalPlayer_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return LoginCode.ZinnySession_GetLocalPlayer_UnknownError;
      }
    }

    session.close();

    this.auth = new Auth(this.deviceId, playerId, zatExpiryTime, zat);

    console.log(this.auth);

    try {
      const signup = await Priconne.Tool.Signup2(this.auth);
      console.log(signup);

    } catch (e) {

    }

    console.log(this.auth);
    // await Priconne.Tool.KakaoDropoutCancel();

    // await Priconne.Load.Index();

    // await Priconne.Home.Index();

//    const api = new Priconne.ApiService();
//    api.get(Priconne.Tool.SignUp2, )

    this.logged = true;
    return LoginCode.Success;
  }

  public async logout(): Promise<void> {
    // Logout
    return;
  }

  public async getClanInfo(): Promise<void> {
    // Priconne.API.Clan.OthersInfo();
  }

  public async getProfile(): Promise<void> {

    // Priconne.API.Profile.GetProfile();
  }
}

export default CyUtils;
