export class UserSetting {
  /** User setting unique identifier */
  id: string;

  canDeposit: boolean;
  canWithdraw: boolean;
  canAutoWithdraw: boolean;
  maxAutoWithdrawAmount?: number | null;

  createdAt: Date;
  updatedAt: Date;

  constructor(data?: UserSetting) {
    if (data) {
      this.id = data.id;

      this.canDeposit = data.canDeposit;
      this.canWithdraw = data.canWithdraw;
      this.canAutoWithdraw = data.canAutoWithdraw;
      this.maxAutoWithdrawAmount = data.maxAutoWithdrawAmount;

      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
