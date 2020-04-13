import key from './config/key.json';
import { CyUtils, ErrorCode } from './cyutils';

(async (): Promise<void> => {
  const cy = new CyUtils(key.deviceId, key.whiteKey);
  const b = await cy.login();
  console.log('login: '+ ErrorCode[b]);
  const profile = await cy.getProfile(947922977179);
  console.log(JSON.stringify(profile));

  // const clan = await cy.getClanInfo(3124);
  // console.log(JSON.stringify(clan));
})();
