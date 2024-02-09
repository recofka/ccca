import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

test("it should create a passenger account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  //   expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("it should request a ride", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "71428793860",
    isPassenger: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.7154887029113,
    fromLong: -48.50264094019843,
    toLat: -27.496887588317275,
    toLong: -48.45490814818396,
  };
  const responseRequestRide = await axios.post(
    "http://localhost:3000/request_ride",
    inputRequestRide
  );
  const outputRequestRide = responseRequestRide.data;
  expect(outputRequestRide.rideId).toBeDefined();

  // const responseGetRide = await axios.get(
  //   `http://localhost:3000/rides/${outputRequestRide.rideId}`
  // );
  // const outputGetRide = responseGetRide.data;

  // expect(responseRequestRide.status).toBe(200);
  // expect(outputGetRide.passengerId).toBe(outputSignup.passengerId);
  // expect(outputGetRide.rideId).toBe(outputRequestRide.ride_id);
  // expect(outputGetRide.from_lat).toBe("-27.7154887029113");
  // expect(outputGetRide.status).toBe("requested");
  // expect(outputGetRide.date).toBeDefined();
});

test("it should not request a ride if user is not a passenger", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.7154887029113,
    fromLong: -48.50264094019843,
    toLat: -27.496887588317275,
    toLong: -48.45490814818396,
  };
  const responseRequestRide = await axios.post(
    "http://localhost:3000/request_ride",
    inputRequestRide
  );
  const outputRequestRide = responseRequestRide.data;
  expect(responseRequestRide.status).toBe(422);
  expect(outputRequestRide.message).toBe("Account is not from a passenger");
});

test("it should not request a ride if the passenger has another active ride ongoing", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.7154887029113,
    fromLong: -48.50264094019843,
    toLat: -27.496887588317275,
    toLong: -48.45490814818396,
  };
  await axios.post("http://localhost:3000/request_ride", inputRequestRide);
  const responseRequestRide = await axios.post(
    "http://localhost:3000/request_ride",
    inputRequestRide
  );
  const outputRequestRide = responseRequestRide.data;
  expect(responseRequestRide.status).toBe(422);
  expect(outputRequestRide.message).toBe("Passenger has an active ride");
});
