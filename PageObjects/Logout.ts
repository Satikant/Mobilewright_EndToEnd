// import { Screen } from 'mobilewright';

export class Logout {
  private screen: any;
  private nextButton;

  constructor(screen: any) {
    this.screen = screen;
    // again, swap for your app's real locator
    this.nextButton = screen.getByRole('button', { name: 'Next' });
  }

  async logout() {
    await this.nextButton.tap();
  }
}