import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarAvailabilityDto } from './dto/carAvailability.dto';

@Controller('cars')
export class CarsController {
    async onModuleInit() {
        await this.carsService.createTableIfNotExists();
    }

    constructor(private readonly carsService: CarsService) {}

    @Get()
    getAllCarData(): Promise<object> {
        return this.carsService.getAllCarData();
    }

    @Get('price/:days')
    calculatePrice(@Param('days') days: number): number {
        return this.carsService.totalRentalPrice(days);
    }

    @Post()
    // checkCarAvailability(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    // checkCarAvailability(@Param('id') id: string): Promise<object> {
    //     return this.carsService.checkCarAvailability(id);
    // }
    @UsePipes(new ValidationPipe({ transform: true }))
    checkCarAvailability(@Body() data: CarAvailabilityDto): Promise<object> {
        return this.carsService.checkCarAvailability(data);
    }
}
