/**
 * Contract for login (Java interface). Android and iOS pages can implement
 * this independently while tests depend only on the contract (polymorphism).
 */
export interface LoginContract {
  handleUsbDebuggingIfPresent(): Promise<void>;
  selectTenant(tenantName?: string): Promise<void>;
  chooseMobileEmail(): Promise<void>;
  chooseUserId(): Promise<void>;
  login(username: string, password: string): Promise<void>;
}
