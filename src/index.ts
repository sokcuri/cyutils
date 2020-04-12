import * as Kakaogames from './kakaogames';
import * as error from './error';
import zinnyConfig from './config/zinny.json';
import adidInfo from './config/adid.json';

export class CyUtils {
  private logged: boolean;

  constructor() {
    this.logged = false;
  }

  public async login() {
    let appInfo: object;
    let accessToken: object;

    try {
      appInfo = await Kakaogames.ZinnyInfoDesk.GetAppInfo(zinnyConfig, adidInfo);
    } catch(e) {
      if (e instanceof error.ZinnyInfoDesk.NotFoundError) {
        console.log('ZinnyInfoDesk::NotFoundError', e.message);
      } else if (e instanceof error.ZinnyInfoDesk.InvalidJsonError) {
        console.log('ZinnyInfoDesk::InvalidJsonError', e.message);
      } else if (e instanceof error.ZinnyInfoDesk.UnknownError) {
        console.log('ZinnyInfoDesk::UnknownError', e.message);
      } else {
        console.log(e);
      }
    }

    try {
      accessToken = await Kakaogames.ZinnyAccessToken.CreateWithPreviousInfo(zinnyConfig, adidInfo);
    } catch(e) {
      if (e instanceof error.ZinnyAccessToken.NotFoundError) {
        console.log('ZinnyAccessToken::NotFoundError', e.message);
      } else if (e instanceof error.ZinnyAccessToken.InvalidJsonError) {
        console.log('ZinnyAccessToken::InvalidJsonError', e.message);
      } else if (e instanceof error.ZinnyAccessToken.UnknownError) {
        console.log('ZinnyAccessToken::UnknownError', e.message);
      } else {
        console.log(e);
      }
    }

    console.log(appInfo);
    console.log(accessToken);

    // Priconne.API.signup();
  }

  public Logout() {

  }

  public GetClanInfo() {
    // Priconne.API.Clan.OthersInfo();
  }

  public GetProfile() {

    // Priconne.API.Profile.GetProfile();
  }
}
(async () => {
  const cy = new CyUtils()
  cy.login();
})();

export default CyUtils;
