import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignRolesDto {
  @IsArray({ message: 'roles inválidos' })
  @IsString({ each: true, message: 'roles inválidos' })
  @IsNotEmpty({ each: true, message: 'roles inválidos' })
  roles: string[];
}
