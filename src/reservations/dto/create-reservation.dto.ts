import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export enum ReservationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateReservationDto {

  @IsUUID('all', { message: 'id debe ser un uuid' })
  id: string; 

  @IsUUID('all', { message: 'id_user debe ser un uuid' })
  id_user: string;

  @IsUUID('all', { message: 'id_spot debe ser un uuid' })
  id_spot: string;

  @IsDateString({}, { message: 'date debe ser una fecha válida (ISO 8601)' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'vehicle_plate es requerida' })
  vehicle_plate: string;

  @IsNumber({}, { message: 'vehicle_max_charge debe ser un número' })
  @IsPositive({ message: 'vehicle_max_charge debe ser positivo' })
  vehicle_max_charge: number;
}
