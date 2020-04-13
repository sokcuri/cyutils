import key from './config/key.json';
import CyUtils from './cyutils';

(async (): Promise<void> => {
  const cy = new CyUtils(key.deviceId, key.whiteKey);
  const b = await cy.login();
  console.log('login: '+ b);
})();
