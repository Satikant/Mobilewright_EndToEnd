import { Login } from './Login';
import { Logout } from './Logout';

export class POManager {
  private screen: any;
  private loginPage: Login;
  private logoutPage: Logout;

  constructor(screen: any) {
    this.screen = screen;
    this.loginPage = new Login(screen);
    this.logoutPage = new Logout(screen);
  }

  getLoginScreen() {
    return this.loginPage;
  }

  getLogoutScreen() {
    return this.logoutPage;
  }
}