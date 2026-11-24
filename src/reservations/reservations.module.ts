import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from '../parkings/parking.entity.js';
import { Reservation } from './entities/reservation.entity.js';
import { ReservationsController } from './reservations.controller.js';
import { ReservationPolicy } from './reservations.policy.js';
import { ReservationsService } from './reservations.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Parking])],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationPolicy],
})
export class ReservationsModule {}
