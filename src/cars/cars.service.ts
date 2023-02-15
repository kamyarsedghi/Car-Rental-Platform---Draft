import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/utils/database/database.service';
// import pool from '../utils/database';

@Injectable()
export class CarsService {
    // totalRentalPrice(rentalDays: number, basicTariff: number, recursivePrice: number): number {
    //     if (rentalDays >= 30) {
    //         return null;
    //     }
    //     if (rentalDays <= 0) {
    //         return recursivePrice;
    //     }

    //     if (rentalDays <= 30 && rentalDays >= 18) {
    //         const periodDays = rentalDays - 18;
    //         recursivePrice += periodDays * (basicTariff - basicTariff * 0.15);
    //         return this.totalRentalPrice(rentalDays - periodDays, basicTariff, recursivePrice);
    //     }
    //     if (rentalDays <= 17 && rentalDays >= 10) {
    //         const periodDays = rentalDays - 9;
    //         recursivePrice += periodDays * (basicTariff - basicTariff * 0.1);
    //         return this.totalRentalPrice(rentalDays - periodDays, basicTariff, recursivePrice);
    //     }
    //     if (rentalDays <= 9 && rentalDays >= 5) {
    //         const periodDays = rentalDays - 4;
    //         recursivePrice += periodDays * (basicTariff - basicTariff * 0.05);
    //         return this.totalRentalPrice(rentalDays - periodDays, basicTariff, recursivePrice);
    //     }
    //     if (rentalDays <= 4 && rentalDays >= 1) {
    //         recursivePrice += rentalDays * basicTariff;
    //         return recursivePrice;
    //     }
    // }
    constructor(private readonly _db: DatabaseService) {}

    totalRentalPrice(days: number): number {
        if (days <= 4) {
            return days * 1000;
        } else if (days <= 9) {
            return this.totalRentalPrice(4) + (days - 4) * (1000 * 0.95);
        } else if (days <= 17) {
            return this.totalRentalPrice(9) + (days - 9) * (1000 * 0.9);
        } else if (days <= 30) {
            return this.totalRentalPrice(17) + (days - 17) * (1000 * 0.85);
        }
    }

    async getAllCarData(): Promise<object> {
        return await this._db.executeQuery('SELECT * FROM cars').then(result => {
            return result.rows;
        });
    }

    // async checkCarAvailability(id: string): Promise<object> {
    //     const query = `SELECT availability FROM cars WHERE id = '${id}'`;
    //     console.log(query);
    //     return await this._db.executeQuery(query).then(result => {
    //         return result.rows;
    //     });
    // }

    async checkCarAvailability(data): Promise<boolean> {
        const { carId, startDate, endDate } = data;

        const query = `SELECT * FROM reservations WHERE car_id = '${carId}' AND start_date <= '${endDate.toISOString()}' AND end_date < '${startDate.toISOString()}'`;
        console.log(query);

        // const query2 = `SELECT * FROM reservations WHERE id = '1'`;

        return await this._db.executeQuery(query).then(result => {
            return result.rows.length > 0;
        });
    }

    async createTableIfNotExists(): Promise<void> {
        const query = `CREATE TABLE IF NOT EXISTS "reservations" (
            "id" SERIAL PRIMARY KEY,
            "car_id" INTEGER NOT NULL,
            "availability" BOOLEAN NOT NULL,
            "basic_tariff" INTEGER NOT NULL,
            "start_date" TIMESTAMP NOT NULL,
            "end_date" TIMESTAMP NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;
        await this._db.executeQuery(query);
    }
}
