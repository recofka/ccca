import GetAccount from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import RequestRide from "../../application/usecase/RequestRide";
import Signup from "../../application/usecase/Signup";
import HttpServer from "./HttpServer";

export default class MainController {
  constructor(
    httpServer: HttpServer,
    signup: Signup,
    getAccount: GetAccount,
    requestRide: RequestRide,
    getRide: GetRide
  ) {
    httpServer.register(
      "post",
      "/signup",
      async function (params: any, body: any) {
        const output = await signup.execute(body);
        return output;
      }
    );

    httpServer.register(
      "get",
      "/accounts/:accountId",
      async function (params: any, body: any) {
        const output = await getAccount.execute(params.accountId);
        return output;
      }
    );

    httpServer.register(
      "post",
      "/request_ride",
      async function (params: any, body: any) {
        const output = await requestRide.execute(body);
        return output;
      }
    );

    httpServer.register(
      "get",
      "/rides/:rideId",
      async function (params: any, body: any) {
        const ride = await getRide.execute(params.rideId);
        return ride;
      }
    );
  }
}
