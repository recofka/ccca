import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountDAODatabase, { AccountDAOMemory } from "../src/AccountDAO";
import MailerGateway from "../src/MailerGateway";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  // const accountDAO = new AccountDAOMemory();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
});

fdescribe("Signup function", () => {
  test.each(["97456321558", "71428793860", "87748248800"])(
    "it should create a passenger account",
    async () => {
      // given
      const mockInputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
        password: "123456",
      };
      // when
      const outputSignup = await signup.execute(mockInputSignup);
      const outputGetAccount = await getAccount.execute(outputSignup.accountId);
      // then
      expect(outputSignup.accountId).toBeDefined();
      expect(outputGetAccount.name).toBe(mockInputSignup.name);
      expect(outputGetAccount.email).toBe(mockInputSignup.email);
      expect(outputGetAccount.cpf).toBe(mockInputSignup.cpf);
      expect(outputGetAccount.is_passenger).toBe(true);
    }
  );

  test("it should not create account if name is invalid", async () => {
    const mockInputSignupSignup = {
      name: "John",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
      isPassenger: true,
      password: "123456",
    };

    await expect(() => signup.execute(mockInputSignupSignup)).rejects.toThrow(
      new Error("Invalid name")
    );
  });

  test("it should not create account if CPF is invalid", async () => {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "811111",
      isPassenger: true,
      password: "123456",
    };

    await expect(() => signup.execute(mockInputSignup)).rejects.toThrow(
      new Error("Invalid cpf")
    );
  });

  test("it should not create account if email is invalid", async () => {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe.com`,
      cpf: "87748248800",
      isPassenger: true,
      password: "123456",
    };

    await expect(() => signup.execute(mockInputSignup)).rejects.toThrow(
      new Error("Invalid email")
    );
  });

  test("it should not create account if email alredy exists in another account", async () => {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
      isPassenger: true,
      password: "123456",
    };

    await signup.execute(mockInputSignup);
    await expect(() => signup.execute(mockInputSignup)).rejects.toThrow(
      new Error("An account already exists with this email address")
    );
  });

  test("it should create a driver account", async () => {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
      carPlate: "AAA9999",
      isPassenger: false,
      isDriver: true,
      password: "123456",
    };

    const outputSignup = await signup.execute(mockInputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(mockInputSignup.name);
    expect(outputGetAccount.email).toBe(mockInputSignup.email);
    expect(outputGetAccount.cpf).toBe(mockInputSignup.cpf);
    expect(outputGetAccount.is_driver).toBe(mockInputSignup.isDriver);
  });

  test("it should not create an account for the driver with invalid carPlate", async () => {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
      carPlate: "AA",
      isPassenger: false,
      isDriver: true,
      password: "123456",
    };

    await expect(() => signup.execute(mockInputSignup)).rejects.toThrow(
      new Error("Invalid car plate")
    );
  });

  test("it should create a stub passenger account", async function () {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
      isPassenger: true,
    };
    const saveStub = sinon
      .stub(AccountDAODatabase.prototype, "save")
      .resolves();
    const getByEmailStub = sinon
      .stub(AccountDAODatabase.prototype, "getByEmail")
      .resolves();
    const getByIdStub = sinon
      .stub(AccountDAODatabase.prototype, "getById")
      .resolves(mockInputSignup);
    const outputSignup = await signup.execute(mockInputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(mockInputSignup.name);
    expect(outputGetAccount.email).toBe(mockInputSignup.email);
    expect(outputGetAccount.cpf).toBe(mockInputSignup.cpf);
    saveStub.restore();
    getByEmailStub.restore();
    getByIdStub.restore();
  });

  test("it should create a spy passenger account", async function () {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
      isPassenger: true,
    };
    const saveSpy = sinon.spy(AccountDAODatabase.prototype, "save");
    const sendSpy = sinon.stub(MailerGateway.prototype, "send");
    const outputSignup = await signup.execute(mockInputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(mockInputSignup.name);
    expect(outputGetAccount.email).toBe(mockInputSignup.email);
    expect(outputGetAccount.cpf).toBe(mockInputSignup.cpf);
    expect(saveSpy.calledOnce).toBe(true);
    expect(saveSpy.calledWith(mockInputSignup)).toBe(true);
    expect(sendSpy.calledOnce).toBe(true);
    expect(
      sendSpy.calledWith(
        "Welcome",
        mockInputSignup.email,
        "Use this link to confirm your account"
      )
    );
    saveSpy.restore();
    sendSpy.restore();
  });

  test("it should create a mock passenger account", async function () {
    const mockInputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
      isPassenger: true,
    };
    const mailerGatewayMock = sinon.mock(MailerGateway.prototype);
    mailerGatewayMock
      .expects("send")
      .withArgs(
        "Welcome",
        mockInputSignup.email,
        "Use this link to confirm your account"
      )
      .once();
    const outputSignup = await signup.execute(mockInputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(mockInputSignup.name);
    expect(outputGetAccount.email).toBe(mockInputSignup.email);
    expect(outputGetAccount.cpf).toBe(mockInputSignup.cpf);
    mailerGatewayMock.verify();
    mailerGatewayMock.restore();
  });
});
