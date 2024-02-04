import express from "express";
import Signup from "./Signup";
import AccountDAODatabase from "./AccountDAO";
import RideDAODatabase from "./RideDAO";
import GetAccount from "./GetAccount";
import crypto from "crypto";
import pgp from "pg-promise";
import RequestRide from "./RequestRide";
import GetRide from "./GetRide";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const accountDAO = new AccountDAODatabase();
  const signup = new Signup(accountDAO);
  const output = await signup.execute(req.body);
  res.json(output);
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountDAO = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDAO);
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});

app.post("/request_ride", async function (req, res) {
  try {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    const requestRide = new RequestRide(accountDAO, rideDAO);
    const output = await requestRide.execute(req.body);
    res.json(output);
  } catch (error: any) {
    return res.status(422).json({
      message: error.message,
    });
  }
});

app.get("/rides/:rideId", async function (req, res) {
  const rideDAO = new RideDAODatabase();
  const getRide = new GetRide(rideDAO);
  const ride = await getRide.execute(req.params.rideId);
  res.json(ride);
});

app.listen(3000);
