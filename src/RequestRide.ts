import crypto from "crypto";
import IAccountDAO from "./AccountDAO";
import IRideDAO from "./RideDAO";

export default class RequestRide {
  constructor(readonly accountDAO: IAccountDAO, readonly rideDAO: IRideDAO) {}

  async execute(input: Input): Promise<Output> {
    const ride = {
      rideId: crypto.randomUUID(),
      status: "requested",
      date: new Date(),
      ...input,
    };
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account.is_passenger)
      throw new Error("Account is not from a passenger");
    const [activeRide] = await this.rideDAO.getActiveRidesByPassengerId(
      input.passengerId
    );

    if (activeRide) throw new Error("Passenger has an active ride");
    await this.rideDAO.save(ride);
    return { rideId: ride.rideId };
  }
}

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};
