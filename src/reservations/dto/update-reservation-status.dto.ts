import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity.js';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus, {
    message: 'status debe ser uno de los siguientes valores: pending, completed, cancelled',
  })
  status: ReservationStatus;
}
