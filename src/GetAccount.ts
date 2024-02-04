import IAccountDAO from "./AccountDAO";

export default class GetAccount {
  constructor(readonly accountDAO: IAccountDAO) {}

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    // If Adapter Memory uncomment
    // account.is_passenger = account.is_passenger;
    // account.is_driver = account.is_driver;
    return account;
  }
}
