import * as Kakaogames from './kakaogames';
import * as error from './error';
import zinnyConfig from './config/zinny.json';
import adidInfo from './config/adid.json';

export class CyUtils {
  private logged: boolean;

  constructor() {
    this.logged = false;
  }

  public async login(): Promise<void> {
    let appInfo: object;
    let accessToken: object;

    try {
      appInfo = await Kakaogames.ZinnyInfoDesk.GetAppInfo(zinnyConfig, adidInfo);
    } catch (e) {
      if (e instanceof error.ZinnyInfoDesk.NotFoundError) {
        console.error('ZinnyInfoDesk::NotFoundError', e.message);
      } else if (e instanceof error.ZinnyInfoDesk.InvalidJsonError) {
        console.error('ZinnyInfoDesk::InvalidJsonError', e.message);
      } else if (e instanceof error.ZinnyInfoDesk.UnknownError) {
        console.error('ZinnyInfoDesk::UnknownError', e.message);
      } else {
        console.error(e);
      }
    }

    try {
      accessToken = await Kakaogames.ZinnyAccessToken.CreateWithPreviousInfo(zinnyConfig, adidInfo);
    } catch (e) {
      if (e instanceof error.ZinnyAccessToken.NotFoundError) {
        console.error('ZinnyAccessToken::NotFoundError', e.message);
      } else if (e instanceof error.ZinnyAccessToken.InvalidJsonError) {
        console.error('ZinnyAccessToken::InvalidJsonError', e.message);
      } else if (e instanceof error.ZinnyAccessToken.UnknownError) {
        console.error('ZinnyAccessToken::UnknownError', e.message);
      } else {
        console.error(e);
      }
    }

    console.warn(appInfo);
    console.warn(accessToken);

    return;
    // Priconne.API.signup();
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
  cy.login();
})();

export default CyUtils;
