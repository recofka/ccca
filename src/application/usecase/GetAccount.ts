import { transform } from "typescript";
import IAccountRepository from "../../infra/repository/AccountRepository";

export default class GetAccount {
  constructor(readonly accountRepository: IAccountRepository) {}

  async execute(accountId: string) {
    const account = await this.accountRepository.getById(accountId);
    if (!account) throw new Error("Account does not exist");
    return account;
  }
}
