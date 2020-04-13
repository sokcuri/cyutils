/* eslint-disable @typescript-eslint/camelcase */
import * as Kakaogames from './kakaogames';

export enum ZinnyLogin {
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
  private playerId: string;
  private accessToken: string;
  private zat: string;
  private viewerId: string;

  constructor() {
    this.logged = false;
  }

  public async zinnyLogin(): Promise<ZinnyLogin> {
    try {
      const appInfo = await Kakaogames.ZinnyInfoDesk.GetAppInfo();
      if (appInfo.status !== 200) {
        return ZinnyLogin.ZinnyInfoDesk_StatusNotOK;
      }
      if (appInfo.content.appVerStatus !== 'noNeedToUpdate') {
        return ZinnyLogin.ZinnyInfoDesk_AppVerStatus_NeedUpdate;
      }
      if (appInfo.content.svcStatus !== 'open') {
        return ZinnyLogin.ZinnyInfoDesk_ServiceNotOpened;
      }
    } catch (e) {
      if (e instanceof Kakaogames.ZinnyNotFoundError) {
        return ZinnyLogin.ZinnyInfoDesk_NotFoundError;
      } else if (e instanceof Kakaogames.ZinnyInvalidJsonError) {
        return ZinnyLogin.ZinnyInfoDesk_InvalidJsonError;
      } else if (e instanceof Kakaogames.ZinnyUnknownError) {
        return ZinnyLogin.ZinnyInfoDesk_UnknownError;
      }
    }

    try {
      const tokenInfo = await Kakaogames.ZinnyAccessToken.CreateWithPreviousInfo();
      this.accessToken = tokenInfo.accessToken;
    } catch (e) {
      if (e instanceof Kakaogames.ZinnyNotFoundError) {
        return ZinnyLogin.ZinnyAccessToken_NotFoundError;
      } else if (e instanceof Kakaogames.ZinnyInvalidJsonError) {
        return ZinnyLogin.ZinnyAccessToken_InvalidJsonError;
      } else if (e instanceof Kakaogames.ZinnyUnknownError) {
        return ZinnyLogin.ZinnyAccessToken_UnknownError;
      }
    }

    const session = new Kakaogames.SessionService(this.accessToken);

    try {
      const loginRes = await session.login();
      this.playerId = loginRes[2].content.player.playerId;
      this.zat = loginRes[2].content.zat;
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return ZinnyLogin.ZinnySession_Login_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return ZinnyLogin.ZinnySession_Login_UnknownError;
      }
    }

    try {
      await session.setPlayerAgreement(this.playerId);
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return ZinnyLogin.ZinnySession_SetPlayerAgreement_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return ZinnyLogin.ZinnySession_SetPlayerAgreement_UnknownError;
      }
    }

    try {
      await session.getLocalPlayer(this.playerId);
    } catch (e) {
      if (e instanceof Kakaogames.ZinnySessionMismatchCommand) {
        return ZinnyLogin.ZinnySession_GetLocalPlayer_MismatchCommandError;
      } else if (e instanceof Kakaogames.ZinnySessionUnknownError) {
        return ZinnyLogin.ZinnySession_GetLocalPlayer_UnknownError;
      }
    }

    session.close();
    this.logged = true;
    return ZinnyLogin.Success;
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

(async (): Promise<void> => {
  const cy = new CyUtils()
  const b = await cy.zinnyLogin();
  console.log('login: '+ b);
})();

export default CyUtils;
