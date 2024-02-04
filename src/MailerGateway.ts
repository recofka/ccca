export default interface IMailerGateway {
  send(subject: string, recipient: string, message: string): Promise<void>;
}
export class MailerGateway implements IMailerGateway {
  async send(subject: string, recipient: string, message: string) {
    console.log(subject, recipient, message);
  }
}
