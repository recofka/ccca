import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import IMailerGateway from "./MailerGateway";

export interface ISignupAccountDAO {
  save(account: any): Promise<void>;
  getByEmail(email: string): Promise<any>;
}

export default class Signup {
  constructor(
    readonly accountDAO: ISignupAccountDAO,
    readonly mailerGateway: IMailerGateway
  ) {}

  async execute(input: any) {
    input.accountId = crypto.randomUUID();
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount)
      throw new Error("An account already exists with this email address");
    if (isInvalidName(input.name)) throw new Error("Invalid name");
    if (isInvalidEmail(input.email)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && isInvalidCarPlate(input.carPlate))
      throw new Error("Invalid car plate");
    await this.accountDAO.save(input);

    await this.mailerGateway.send(
      "Welcome",
      input.email,
      "Use this link to confirm your account"
    );

    return {
      accountId: input.accountId,
    };

    function isInvalidName(name: string) {
      return !name.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    function isInvalidEmail(email: string) {
      return !email.match(/^(.+)@(.+)$/);
    }

    function isInvalidCarPlate(carPlate: string) {
      return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
    }
  }
}
