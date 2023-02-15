import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/utils/database/database.service';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
    imports: [],
    controllers: [CarsController],
    providers: [CarsService, DatabaseService],
})
export class CarsModule {}
