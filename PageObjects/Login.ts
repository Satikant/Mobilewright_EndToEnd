import { Screen } from 'mobilewright';

export class Login {
  private screen: any;
  private userName;
  private passWord;
  private submitBtn;

  constructor(screen:any) {
    this.screen = screen;
    this.userName = screen.getByLabel('Username');
    this.passWord = screen.getByLabel('Password');
    this.submitBtn = screen.getByRole('button', { name: 'Next' });
  }
  async usbDebuggingHandle(){
  const checkbox = this.screen.getByText('I understand the risk and choose to proceed with USB de-bugging enabled on my devices.');
  await checkbox.tap();// tap to check it
  await this.screen.getByText('PROCEED ANYWAY').tap();
  }
  async tenantSelection(){
    await this.screen.getByLabel('Select country label').tap();
    await this.screen.getByText('Evelyn').tap();
    await this.screen.getByLabel('Continue').tap();

  }
  async login(username: string, password: string) {
    await this.userName.fill(username);
    await this.passWord.fill(password);
    await this.submitBtn.tap();
  }
  async tapMobile_Email(){
    await this.screen.getByText('Mobile/Email').tap();
  }
  async tapUserID(){
    await this.screen.getByText('User ID').tap();
  }
}
