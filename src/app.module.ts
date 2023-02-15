import { Module } from '@nestjs/common';
import { CarsService } from './cars/cars.service';
import { CarsController } from './cars/cars.controller';
import { CarsModule } from './cars/cars.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './utils/database/database.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            cache: false,
        }),
        CarsModule,
    ],
    providers: [CarsService, DatabaseService],
    controllers: [CarsController],
})
export class AppModule {}
