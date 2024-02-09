import IMailerGateway from "../../infra/database/MailerGateway";
import Account from "../../domain/Account";
import IAccountRepository from "../../infra/repository/AccountRepository";

export default class Signup {
  constructor(
    readonly accountRepository: IAccountRepository,
    readonly mailerGateway: IMailerGateway
  ) {}

  async execute(input: any) {
    const existingAccount = await this.accountRepository.getByEmail(
      input.email
    );
    if (existingAccount)
      throw new Error("An account already exists with this email address");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate
    );
    await this.accountRepository.save(account);
    await this.mailerGateway.send(
      "Welcome",
      account.email,
      "Use this link to confirm your account"
    );

    return {
      accountId: account.accountId,
    };
  }
}
