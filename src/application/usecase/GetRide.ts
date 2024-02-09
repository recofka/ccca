import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.get(rideId);
    if (!ride) throw new Error("Ride not found");
    const passenger = await this.accountRepository.getById(ride.passengerId);
    if (!passenger) throw new Error("Passenger not found");
    return {
      passengerId: ride.passengerId,
      rideId: ride.rideId,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      status: ride.status,
      date: ride.date,
      passengerName: passenger.name,
    };
  }
}

type Output = {
  passengerId: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  passengerName: string;
};
