import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum} from 'class-validator';

export enum ChargerType {
  STANDARD = 'standard',
  FAST = 'fast',
  ULTRA_FAST = 'ultra_fast',
}

export class CreateParkingDto {
  @IsUUID('all', { message: 'id debe ser un uuid' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'code es requerida' })
  code: string;
  
  @IsString()
  @IsNotEmpty({ message: 'charger_type es requerida' })
  @IsEnum(ChargerType, { message: 'charger_type debe ser uno de los siguientes valores: standard, fast, ultra_fast' })
  charger_type: ChargerType;

  @IsUUID('all', { message: 'id_supervisor debe ser un uuid' })
  id_supervisor: string;

}
