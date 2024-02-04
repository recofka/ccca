import IRideDAO from "./RideDAO";

export default class GetRide {
  constructor(readonly rideDAO: IRideDAO) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideDAO.get(rideId);
    return ride;
  }
}

type Output = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
};
