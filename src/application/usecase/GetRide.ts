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
      driverId: ride.getDriverId(),
      rideId: ride.rideId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      lastLat: ride.getLastLat(),
      lastLong: ride.getLastLong(),
      distance: ride.getDistance(),
      date: ride.date,
      passengerName: passenger.getName(),
    };
  }
}

type Output = {
  passengerId: string;
  driverId?: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  lastLat: number;
  lastLong: number;
  distance: number;
  date: Date;
  passengerName: string;
};
