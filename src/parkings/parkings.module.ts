import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { Parking } from './parking.entity.js';
import { ParkingPolicy } from './parking.policy.js';
import { ParkingsController } from './parkings.controller.js';
import { ParkingsService } from './parkings.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Parking]), UsersModule],
  controllers: [ParkingsController],
  providers: [ParkingsService, ParkingPolicy],
})
export class ParkingsModule {}
