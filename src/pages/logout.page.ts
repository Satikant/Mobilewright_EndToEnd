import type { Device, Screen } from '@mobilewright/core';
import { BasePage } from './base.page.ts';
import type { Logger } from '../logging/logger.ts';

export class LogoutPage extends BasePage {
  private readonly nextButton;

  constructor(screen: Screen, device: Device, logger: Logger) {
    super(screen, device, logger.child('LogoutPage'));
    this.nextButton = screen.getByRole('button', { name: 'Next' });
  }

  async logout(): Promise<void> {
    this.logger.info('logging out');
    await this.nextButton.tap();
  }
}
