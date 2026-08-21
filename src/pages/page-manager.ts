import type { Device, Screen } from '@mobilewright/core';
import type { Logger } from '../logging/logger.ts';
import type { LoginContract } from './contracts/login.contract.ts';
import { LoginPage } from './login.page.ts';
import { LogoutPage } from './logout.page.ts';

/**
 * Facade over all screens (your previous POManager).
 * Tests talk to PageManager, not to constructors — easy to swap platform pages later.
 */
export class PageManager {
  readonly login: LoginContract;
  readonly logout: LogoutPage;

  constructor(screen: Screen, device: Device, logger: Logger) {
    this.login = new LoginPage(screen, device, logger);
    this.logout = new LogoutPage(screen, device, logger);
  }
}
