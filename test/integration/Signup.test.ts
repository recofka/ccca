import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
import GetAccount from "../../src/application/usecase/GetAccount";
import MailerGateway from "../../src/infra/gateway/MailerGateway";
import Signup from "../../src/application/usecase/Signup";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountDAO = new AccountRepositoryDatabase(connection);
  const mailerGateway: MailerGateway = {
    async send(
      subject: string,
      recipient: string,
      message: string
    ): Promise<void> {},
  };
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO);
});

test("It should create a passenger account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.getName()).toBe(input.name);
  expect(outputGetAccount.getEmail()).toBe(input.email);
  expect(outputGetAccount.getCpf()).toBe(input.cpf);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("It should create a driver account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.getName()).toBe(input.name);
  expect(outputGetAccount.getEmail()).toBe(input.email);
  expect(outputGetAccount.getCpf()).toBe(input.cpf);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("It should not create account if name is invalid", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("It should not create account if email is invalid", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("It should not create account if CPF is invalid", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "974563215",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid cpf")
  );
});

test("It should not create account if email alredy exists in another accoun", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});

test("It should not create an account for the driver with invalid carPlate", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA999",
    isDriver: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

afterEach(async () => {
  await connection.close();
});
