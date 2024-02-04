import pgp from "pg-promise";

export default interface IRideDAO {
  save(ride: any): Promise<any>;
  get(rideId: string): Promise<any>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
}

export default class RideDAODatabase implements IRideDAO {
  async save(ride: any) {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/postgres"
    );
    await connection.query(
      "insert into cccat15.ride(ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.status,
        ride.date,
      ]
    );
    await connection.$pool.end();
  }

  async get(rideId: any) {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/postgres"
    );
    const [ride] = await connection.query(
      "select * from cccat15.ride where ride_id =$1",
      [rideId]
    );
    await connection.$pool.end();
    return ride;
  }

  async getActiveRidesByPassengerId(passengerId: any) {
    const connection = pgp()(
      "postgres://postgres:123456@localhost:5432/postgres"
    );
    const activeRides = await connection.query(
      "select * from cccat15.ride where passenger_id = $1 and status='requested'",
      passengerId
    );
    await connection.$pool.end();
    return activeRides;
  }
}
