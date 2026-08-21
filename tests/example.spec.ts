import { test, expect } from '@mobilewright/test';
import {POManager} from '../PageObjects/POManager';
// const dataset = JSON.parse(JSON.stringify(require('../utils/TestData.json')));

test('app launches and shows home screen', async ({ screen, device }) => {
  const poManager = new POManager(screen);
  await poManager.getLoginScreen().usbDebuggingHandle();
  await poManager.getLoginScreen().tenantSelection();
  await poManager.getLoginScreen().tapMobile_Email();
  await poManager.getLoginScreen().login('7773730615', '1357');
  // const welcomeheader= this.scwelcomeHeader = screen.getByText(/^Welcome/i);
  
  // await expect
});
