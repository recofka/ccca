import IAccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAO";

export default class GetAccount {
  constructor(readonly accountDAO: IAccountDAO) {}

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    account.is_passenger = account.isPassenger;
    account.is_driver = account.isDriver;
    return account;
  }
}
