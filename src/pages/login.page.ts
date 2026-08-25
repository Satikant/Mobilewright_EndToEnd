import type { Device, Screen } from '@mobilewright/core';
import { BasePage } from './base.page.ts';
import type { LoginContract } from './contracts/login.contract.ts';
import type { Logger } from '../logging/logger.ts';

export class LoginPage extends BasePage implements LoginContract {
  private readonly userName;
  private readonly passWord;
  private readonly submitBtn;

  constructor(screen: Screen, device: Device, logger: Logger) {
    super(screen, device, logger.child('LoginPage'));
    this.userName = screen.getByLabel('Username');
    this.passWord = screen.getByLabel('Password');
    this.submitBtn = screen.getByRole('button', { name: 'Next' });
  }

  async handleUsbDebuggingIfPresent(): Promise<void> {
    const checkbox = this.screen.getByText(
      'I understand the risk and choose to proceed with USB de-bugging enabled on my devices.',
    );
    if (await checkbox.isVisible({ timeout: 5_000 }).catch(() => false)) {
      this.logger.info('USB debugging consent is visible');
      await checkbox.tap();
      await this.screen.getByText('PROCEED ANYWAY').tap();
    }
  }

  async selectTenant(tenantName = 'Evelyn'): Promise<void> {
    this.logger.info('selecting tenant', { tenantName });
    await this.screen.getByLabel('Select country label').tap();
    await this.screen.getByText(tenantName).tap();
    await this.screen.getByLabel('Continue').tap();
  }

  async chooseMobileEmail(): Promise<void> {
    await this.screen.getByText('Mobile/Email').tap();
  }

  async chooseUserId(): Promise<void> {
    await this.screen.getByText('User ID').tap();
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.info('logging in', { username });
    await this.userName.fill(username);
    await this.passWord.fill(password);
    await this.submitBtn.tap();
  }
}
