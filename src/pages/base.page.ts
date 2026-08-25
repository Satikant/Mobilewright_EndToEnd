import type { Device, Screen } from '@mobilewright/core';
import { expect } from '@mobilewright/test';
import { Logger } from '../logging/logger.ts';

/**
 * Abstract page: shared actions every screen inherits.
 * Maps to a Java abstract BasePage — locators stay private in subclasses (encapsulation).
 */
export abstract class BasePage {
  protected constructor(
    protected readonly screen: Screen,
    protected readonly device: Device,
    protected readonly logger: Logger,
  ) {}

  protected async tapText(text: string | RegExp): Promise<void> {
    this.logger.debug(`tap text: ${text}`);
    await this.screen.getByText(text).tap();
  }

  protected async tapLabel(label: string): Promise<void> {
    this.logger.debug(`tap label: ${label}`);
    await this.screen.getByLabel(label).tap();
  }

  async expectVisible(text: string | RegExp): Promise<void> {
    await expect(this.screen.getByText(text)).toBeVisible();
  }

  async swipe(direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
    this.logger.debug(`swipe ${direction}`);
    await this.screen.swipe(direction);
  }

  async goBack(): Promise<void> {
    await this.screen.goBack();
  }

  async screenshot(name: string): Promise<void> {
    await this.logger.attachScreenshot(this.screen, name);
  }
}
