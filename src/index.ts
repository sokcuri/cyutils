import * as Kakaogames from './kakaogames';
import zinnyConfig from './config/zinny.json';
import adidInfo from './config/adid.json';
import { ZinnyNotFoundError, ZinnyInvalidJsonError, ZinnyUnknownError } from './kakaogames/zinny/error';

export class CyUtils {
  private logged: boolean;

  constructor() {
    this.logged = false;
  }

  public async login(): Promise<void> {
    try {
      const appInfo = await Kakaogames.ZinnyInfoDesk.GetAppInfo();
      console.warn(appInfo);
    } catch (e) {
      if (e instanceof ZinnyNotFoundError) {
        console.error('ZinnyInfoDesk::NotFoundError', e.message);
      } else if (e instanceof ZinnyInvalidJsonError) {
        console.error('ZinnyInfoDesk::InvalidJsonError', e.message);
      } else if (e instanceof ZinnyUnknownError) {
        console.error('ZinnyInfoDesk::UnknownError', e.message);
      } else {
        console.error(e);
      }
    }

    try {
      const accessToken = await Kakaogames.ZinnyAccessToken.CreateWithPreviousInfo();
      console.warn(accessToken);
    } catch (e) {
      if (e instanceof ZinnyNotFoundError) {
        console.error('ZinnyAccessToken::NotFoundError', e.message);
      } else if (e instanceof ZinnyInvalidJsonError) {
        console.error('ZinnyAccessToken::InvalidJsonError', e.message);
      } else if (e instanceof ZinnyUnknownError) {
        console.error('ZinnyAccessToken::UnknownError', e.message);
      } else {
        console.error(e);
      }
    }


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
